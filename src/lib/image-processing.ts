export interface ProcessedImage {
  grayscale: Uint8Array;
  alpha: Uint8Array;
  /** Un-premultiplied source colour per sample, 3 bytes each. Used by the
   *  source colour mode; the luma path ignores it. */
  rgb: Uint8Array;
  width: number;
  height: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Scale image to fit within maxDimension while preserving aspect ratio,
 * then sample at every `scale` pixels to create the dot grid.
 */
export function processImage(
  img: HTMLImageElement,
  maxDimension: number,
  scale: number,
  contrast: number,
  gamma: number,
  blur: number,
  highlightsCompression = 0
): ProcessedImage {
  const aspect = img.naturalWidth / img.naturalHeight;
  let outW: number, outH: number;
  if (aspect >= 1) {
    outW = maxDimension;
    outH = Math.round(maxDimension / aspect);
  } else {
    outH = maxDimension;
    outW = Math.round(maxDimension * aspect);
  }

  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;

  // Reuse one canvas for both alpha and pixel sampling
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Get alpha mask from the unblurred image so edges stay crisp
  ctx.drawImage(img, 0, 0, outW, outH);
  const alphaData = ctx.getImageData(0, 0, outW, outH).data;

  // Apply blur at source resolution with padding to avoid edge darkening,
  // then downsample onto the same output canvas
  if (blur > 0) {
    const pad = Math.ceil(blur * 3);
    const blurCanvas = document.createElement("canvas");
    blurCanvas.width = srcW + pad * 2;
    blurCanvas.height = srcH + pad * 2;
    const blurCtx = blurCanvas.getContext("2d")!;
    blurCtx.filter = `blur(${blur}px)`;
    blurCtx.drawImage(img, pad, pad, srcW, srcH);

    ctx.clearRect(0, 0, outW, outH);
    ctx.drawImage(blurCanvas, pad, pad, srcW, srcH, 0, 0, outW, outH);
  }

  const pixels = ctx.getImageData(0, 0, outW, outH).data;

  const sampledW = Math.ceil(outW / scale);
  const sampledH = Math.ceil(outH / scale);
  const grayscale = new Uint8Array(sampledW * sampledH);
  const alpha = new Uint8Array(sampledW * sampledH);
  const rgb = new Uint8Array(sampledW * sampledH * 3);

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let sy = 0; sy < sampledH; sy++) {
    for (let sx = 0; sx < sampledW; sx++) {
      const px = Math.min(Math.round(sx * scale), outW - 1);
      const py = Math.min(Math.round(sy * scale), outH - 1);
      const idx = (py * outW + px) * 4;

      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const blurredAlpha = pixels[idx + 3] / 255;

      const si = sy * sampledW + sx;
      alpha[si] = alphaData[idx + 3];

      // Un-premultiply so edge pixels keep their true colour, same as luma below.
      const ua = pixels[idx + 3] / 255;
      const inv = ua > 0.01 ? 1 / ua : 0;
      rgb[si * 3] = Math.min(255, r * inv);
      rgb[si * 3 + 1] = Math.min(255, g * inv);
      rgb[si * 3 + 2] = Math.min(255, b * inv);

      // Un-premultiply the blurred RGB so edge pixels retain their true color.
      // The separate alpha mask handles transparency cutoff in the dither step.
      let luma: number;
      if (blurredAlpha > 0.01) {
        luma = (0.299 * r + 0.587 * g + 0.114 * b) / blurredAlpha;
      } else {
        luma = 0;
      }

      if (contrast !== 0) {
        luma = contrastFactor * (luma - 128) + 128;
      }

      if (gamma !== 1.0) {
        luma = 255 * Math.pow(Math.max(0, luma / 255), 1 / gamma);
      }

      if (highlightsCompression > 0) {
        const norm = luma / 255;
        const compressed = norm < 0.5
          ? norm
          : 0.5 + (norm - 0.5) * (1 - highlightsCompression);
        luma = compressed * 255;
      }

      grayscale[sy * sampledW + sx] = Math.max(0, Math.min(255, Math.round(luma)));
    }
  }

  return { grayscale, alpha, rgb, width: sampledW, height: sampledH };
}
