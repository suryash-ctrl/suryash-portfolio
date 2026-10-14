export interface Shockwave {
  x: number;
  y: number;
  start: number;
}

export interface DotSystem {
  count: number;
  baseX: Float32Array;
  baseY: Float32Array;
  dx: Float32Array;
  dy: Float32Array;
  size: number;
  /** Pre-composed ABGR pixel per dot, sampled from the source image.
   *  Present only in source colour mode. Undefined means every dot uses
   *  the single theme colour, which is the original behaviour. */
  colors?: Uint32Array;
}

/** Source colour sampling for createDotSystem. */
export interface DotColorSource {
  /** 3 bytes per grid sample, from ProcessedImage.rgb */
  rgb: Uint8Array;
  /** grid width, i.e. ProcessedImage.width */
  gridW: number;
  /** 0 keeps the source colour, 1 pushes fully to its own hue at full saturation */
  saturate?: number;
  /** multiplies lightness, useful for lifting a dark photo off a dark ground */
  lift?: number;
  /** Drop dots that cannot be seen against the page.
   *  "dark"  culls near-black dots, so shadows fall away to a dark ground.
   *  "light" culls near-white dots, so highlights fall away to a light ground.
   *  Without this the image fills in solid on whichever end matches the page
   *  and stops reading as something made of dots. */
  cull?: "dark" | "light" | "none";
  /** 0..255 luma cutoff for cull */
  cullAt?: number;
}

const SHOCKWAVE_SPEED = 225;
const SHOCKWAVE_WIDTH = 37;
const SHOCKWAVE_STRENGTH = 20;
const SHOCKWAVE_DURATION = 675;
const MOUSE_RADIUS = 100;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
const MOUSE_FORCE_PEAK = 40;
const EASING = 0.12;
const SNAP_THRESHOLD = 0.01;

export function createDotSystem(
  points: Float32Array,
  scaleFactor: number,
  dotScale: number,
  offsetX: number,
  offsetY: number,
  colorSource?: DotColorSource
): DotSystem {
  const count = points.length / 2;
  const baseX = new Float32Array(count);
  const baseY = new Float32Array(count);
  const dx = new Float32Array(count);
  const dy = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    baseX[i] = offsetX + points[i * 2] * scaleFactor;
    baseY[i] = offsetY + points[i * 2 + 1] * scaleFactor;
  }

  const sys: DotSystem = { count, baseX, baseY, dx, dy, size: scaleFactor * dotScale };

  if (colorSource) {
    const { rgb, gridW, saturate = 0, lift = 1, cull = "none", cullAt = 40 } = colorSource;
    const colors = new Uint32Array(count);
    const keep = cull === "none" ? null : new Uint8Array(count);
    const maxSample = rgb.length / 3 - 1;
    let kept = 0;

    for (let i = 0; i < count; i++) {
      // points are grid coordinates, so they index the sample grid directly
      const gx = points[i * 2] | 0;
      const gy = points[i * 2 + 1] | 0;
      const si = Math.min(maxSample, Math.max(0, gy * gridW + gx));

      let r = rgb[si * 3];
      let g = rgb[si * 3 + 1];
      let b = rgb[si * 3 + 2];

      if (saturate > 0) {
        // push each channel away from the pixel's own mean
        const mean = (r + g + b) / 3;
        r = mean + (r - mean) * (1 + saturate);
        g = mean + (g - mean) * (1 + saturate);
        b = mean + (b - mean) * (1 + saturate);
      }

      if (lift !== 1) {
        r *= lift;
        g *= lift;
        b *= lift;
      }

      r = r < 0 ? 0 : r > 255 ? 255 : r | 0;
      g = g < 0 ? 0 : g > 255 ? 255 : g | 0;
      b = b < 0 ? 0 : b > 255 ? 255 : b | 0;

      // ABGR, little-endian, matching renderDots
      colors[i] = (255 << 24) | (b << 16) | (g << 8) | r;

      if (keep) {
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const visible = cull === "dark" ? luma >= cullAt : luma <= 255 - cullAt;
        keep[i] = visible ? 1 : 0;
        if (visible) kept++;
      }
    }

    if (keep && kept < count) {
      // rebuild the arrays without the invisible dots so the render loop
      // never walks them
      const nx = new Float32Array(kept);
      const ny = new Float32Array(kept);
      const nc = new Uint32Array(kept);
      let j = 0;
      for (let i = 0; i < count; i++) {
        if (!keep[i]) continue;
        nx[j] = baseX[i];
        ny[j] = baseY[i];
        nc[j] = colors[i];
        j++;
      }
      sys.count = kept;
      sys.baseX = nx;
      sys.baseY = ny;
      sys.dx = new Float32Array(kept);
      sys.dy = new Float32Array(kept);
      sys.colors = nc;
    } else {
      sys.colors = colors;
    }
  }

  return sys;
}

export function updateDots(
  sys: DotSystem,
  mouseX: number,
  mouseY: number,
  mouseActive: boolean,
  shockwaves: Shockwave[],
  now: number
): boolean {
  const { count, baseX, baseY, dx, dy } = sys;

  let numActive = shockwaves.length;
  for (let k = shockwaves.length - 1; k >= 0; k--) {
    if (now - shockwaves[k].start >= SHOCKWAVE_DURATION) {
      shockwaves.splice(k, 1);
      numActive--;
    }
  }

  const shockMultiplier = numActive > 0 ? 1 + 0.5 * (numActive - 1) : 0;
  let hasMotion = false;

  for (let i = 0; i < count; i++) {
    let targetFx = 0;
    let targetFy = 0;

    if (mouseActive) {
      const vx = (baseX[i] + dx[i]) - mouseX;
      const vy = (baseY[i] + dy[i]) - mouseY;
      const dist2 = vx * vx + vy * vy;

      if (dist2 > 0.1 && dist2 < MOUSE_RADIUS_SQ) {
        const dist = Math.sqrt(dist2);
        const falloff = 1 - dist / MOUSE_RADIUS;
        const force = falloff * falloff * falloff * MOUSE_FORCE_PEAK;
        targetFx += (vx / dist) * force;
        targetFy += (vy / dist) * force;
      }
    }

    for (let k = 0; k < shockwaves.length; k++) {
      const sw = shockwaves[k];
      const elapsed = now - sw.start;
      const radius = (elapsed / 1000) * SHOCKWAVE_SPEED;
      const life = 1 - elapsed / SHOCKWAVE_DURATION;

      const sx = baseX[i] - sw.x;
      const sy = baseY[i] - sw.y;
      const dist = Math.sqrt(sx * sx + sy * sy);

      if (dist >= 0.1) {
        const band = Math.abs(dist - radius);
        if (band < SHOCKWAVE_WIDTH) {
          const waveForce =
            (1 - band / SHOCKWAVE_WIDTH) *
            life *
            SHOCKWAVE_STRENGTH *
            shockMultiplier;
          targetFx += (sx / dist) * waveForce;
          targetFy += (sy / dist) * waveForce;
        }
      }
    }

    dx[i] += (targetFx - dx[i]) * EASING;
    dy[i] += (targetFy - dy[i]) * EASING;

    if (Math.abs(dx[i]) < SNAP_THRESHOLD) dx[i] = 0;
    if (Math.abs(dy[i]) < SNAP_THRESHOLD) dy[i] = 0;

    if (dx[i] !== 0 || dy[i] !== 0) hasMotion = true;
  }

  return hasMotion || shockwaves.length > 0 || mouseActive;
}

/* ─── Cached ImageData for zero-alloc rendering ─── */
let _imgData: ImageData | null = null;
let _imgW = 0;
let _imgH = 0;

export function renderDots(
  ctx: CanvasRenderingContext2D,
  sys: DotSystem,
  invert: boolean,
  canvasW: number,
  canvasH: number,
  dpr: number,
  dotColor?: { r: number; g: number; b: number }
): void {
  const w = Math.round(canvasW * dpr);
  const h = Math.round(canvasH * dpr);
  if (w <= 0 || h <= 0) return;

  // Reuse ImageData buffer when dimensions match
  if (!_imgData || _imgW !== w || _imgH !== h) {
    _imgData = ctx.createImageData(w, h);
    _imgW = w;
    _imgH = h;
  }

  const buf32 = new Uint32Array(_imgData.data.buffer);
  buf32.fill(0);

  const r = dotColor ? dotColor.r : invert ? 0 : 138;
  const g = dotColor ? dotColor.g : invert ? 0 : 143;
  const b = dotColor ? dotColor.b : invert ? 0 : 152;

  // Pre-compose ABGR pixel (little-endian). In source colour mode each dot
  // carries its own, so this is only the fallback.
  const flat = (255 << 24) | (b << 16) | (g << 8) | r;
  const colors = sys.colors;

  const size = sys.size * dpr;
  const pad = 0.25 * dpr;
  const totalSize = size + 0.5 * dpr;

  for (let i = 0; i < sys.count; i++) {
    const pixel = colors ? colors[i] : flat;
    const rx = (sys.baseX[i] + sys.dx[i]) * dpr - pad;
    const ry = (sys.baseY[i] + sys.dy[i]) * dpr - pad;

    const x0 = Math.max(0, rx | 0);
    const y0 = Math.max(0, ry | 0);
    const x1 = Math.min(w - 1, (rx + totalSize) | 0);
    const y1 = Math.min(h - 1, (ry + totalSize) | 0);

    for (let py = y0; py <= y1; py++) {
      const rowOff = py * w;
      buf32.fill(pixel, rowOff + x0, rowOff + x1 + 1);
    }
  }

  ctx.putImageData(_imgData, 0, 0);
}
