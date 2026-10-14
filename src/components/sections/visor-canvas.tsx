"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

export interface VisorSignal {
    nx: number; // cursor offset from the head, -1..1
    ny: number;
    dist: number; // cursor distance travelled since last read (px)
}

const RAIN = "01アイウエオカキクサシスセタチ{}<>/=;$#@ABCDEF";
const CODE = [
    "const revenue = await validate(billing);",
    "if (sla.breached) escalate(account);",
    "for (const lead of pipeline) enrich(lead);",
    "workflow.on('inquiry', followUp);",
    "report.mis({ weekly: true, kpi: all });",
    "// 99% data accuracy, every contract",
    "await n8n.run('prospect-enrichment');",
    "crm.sync(marketo, { handoff: 'sales' });",
    "export const assist = (ask) => serve(ask);",
    "SELECT account, risk FROM portfolio;",
    "vba.cut(processing, { saved: '1h' });",
    "claude.draft(caption, platform);",
];
const EMOJI = ["😀", "🚀", "👾", "🤖", "✨", "📈", "🧠", "💬", "🛰️", "⚡", "🎯", "🔥", "😎", "🌐", "📊", "🤝"];
const SCENES = 5;

/** The "video" playing on the visor. Procedural, so it needs no downloaded
 *  clip: five looping scenes (code rain, scrolling source, waveforms, emoji
 *  wall, TV static) drawn to a canvas that is clipped to the glass. The
 *  scene advances on a timer and whenever the cursor has travelled far
 *  enough, and a short frame-tear marks each cut. */
export function VisorCanvas({ signal, active }: { signal: MutableRefObject<VisorSignal>; active: boolean }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasEl = ref.current;
        if (!canvasEl) return;
        const canvas: HTMLCanvasElement = canvasEl;
        const c = canvas.getContext("2d");
        if (!c) return;
        const ctx: CanvasRenderingContext2D = c;

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const W = 360, H = 330; // logical pixels; the CSS box scales it
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const cols = 36, cw = W / cols;
        const drops = Array.from({ length: cols }, () => Math.random() * -30);
        let scene = 0, sceneStart = 0, tear = 0, travelled = 0, energy = 0;
        const emojiGrid = Array.from({ length: 20 }, () => EMOJI[Math.floor(Math.random() * EMOJI.length)]);
        let visible = true, raf = 0, last = 0;

        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.05 });
        io.observe(canvas);

        const next = (now: number) => {
            scene = (scene + 1) % SCENES;
            sceneStart = now;
            tear = 9; // frames of tearing
            travelled = 0;
            ctx.clearRect(0, 0, W, H);
        };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            if (!visible || document.hidden || now - last < 33) return; // ~30 fps
            last = now;
            if (!sceneStart) sceneStart = now;
            const s = signal.current;
            const speed = s.dist; travelled += speed; s.dist = 0;
            energy += (Math.min(1, speed / 60) - energy) * 0.08; // eased cursor speed, 0..1
            if (active && (travelled > 700 || now - sceneStart > 5200)) next(now);

            const t = (now - sceneStart) / 1000;
            const px = s.nx * 16, py = s.ny * 10; // parallax: the picture moves with the gaze

            if (scene === 0) {
                ctx.fillStyle = "rgba(1,8,10,0.2)"; ctx.fillRect(0, 0, W, H);
            } else {
                ctx.clearRect(0, 0, W, H); ctx.fillStyle = "rgba(1,7,10,0.62)"; ctx.fillRect(0, 0, W, H);
            }
            ctx.save(); ctx.translate(px, py);

            if (scene === 0) {
                ctx.font = `${cw * 1.05}px monospace`;
                for (let i = 0; i < cols; i++) {
                    const y = drops[i] * cw * 1.25;
                    for (let k = 0; k < 9; k++) {
                        const ch = RAIN[Math.floor(Math.random() * RAIN.length)];
                        const a = 1 - k / 9;
                        ctx.fillStyle = k === 0 ? "rgba(220,255,245,0.95)" : `rgba(40,${200 + k * 5},${170 - k * 8},${a * 0.9})`;
                        ctx.fillText(ch, i * cw, y - k * cw * 1.25);
                    }
                    drops[i] += 0.5 + (i % 5) * 0.12 + energy * 2;
                    if (y > H + 60 && Math.random() > 0.97) drops[i] = Math.random() * -12;
                }
            } else if (scene === 1) {
                ctx.font = "11px monospace";
                const sp = 26 + energy * 80;
                for (let i = -1; i < 16; i++) {
                    const row = Math.floor((t * sp) / 22) - i;
                    const y = H - (((t * sp) % 22) + i * 22);
                    const line = CODE[((row % CODE.length) + CODE.length) % CODE.length];
                    ctx.fillStyle = ["#6ee7ff", "#ffd479", "#ff6ec7", "#b8ffcf"][((row % 4) + 4) % 4];
                    ctx.globalAlpha = 0.35 + 0.65 * (1 - Math.abs(y - H / 2) / (H / 2));
                    ctx.fillText(line, 22 + (row % 3) * 10, y);
                }
                ctx.globalAlpha = 1;
            } else if (scene === 2) {
                for (let w = 0; w < 5; w++) {
                    ctx.beginPath();
                    ctx.strokeStyle = ["#25f4ee", "#ff2d6f", "#ffd479", "#7a8cff", "#b8ffcf"][w];
                    ctx.lineWidth = 1.6; ctx.globalAlpha = 0.85;
                    for (let x = 0; x <= W; x += 4) {
                        const amp = 26 + energy * 120 + w * 4;
                        const y = H / 2 + Math.sin(x * 0.03 + t * (1.6 + w * 0.5) + w) * amp * Math.sin(t * 0.7 + w + x * 0.004);
                        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                ctx.fillStyle = "rgba(37,244,238,0.25)";
                for (let b = 0; b < 40; b++) { const h = 6 + Math.abs(Math.sin(t * 3 + b * 0.7)) * (30 + energy * 120); ctx.fillRect(b * (W / 40) + 2, H - h - 20, W / 40 - 4, h); }
            } else if (scene === 3) {
                ctx.font = "44px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
                if (Math.floor(t * 6) !== Math.floor((t - 0.033) * 6) || Math.random() < 0.03 + energy) {
                    emojiGrid[Math.floor(Math.random() * emojiGrid.length)] = EMOJI[Math.floor(Math.random() * EMOJI.length)];
                }
                for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
                    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(t * 2 + r + q);
                    ctx.fillText(emojiGrid[r * 5 + q], 36 + q * 72, 40 + r * 80 + Math.sin(t * 2 + q) * 4);
                }
                ctx.globalAlpha = 1; ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
            } else {
                for (let i = 0; i < 900; i++) {
                    const g = Math.random() * 255;
                    ctx.fillStyle = `rgba(${g},${g},${g},${0.5 + Math.random() * 0.4})`;
                    ctx.fillRect(Math.random() * W, Math.random() * H, 3, 2);
                }
                const bars = ["#fff", "#ff0", "#0ff", "#0f0", "#f0f", "#f00", "#00f"];
                if (Math.floor(t * 8) % 2 === 0) bars.forEach((b, i) => { ctx.fillStyle = b; ctx.globalAlpha = 0.55; ctx.fillRect(i * (W / 7), 40 + Math.sin(t * 3) * 20, W / 7, 56); });
                ctx.globalAlpha = 1;
                ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "bold 22px monospace"; ctx.fillText("▶ PLAY  00:0" + Math.floor(t % 10), 24, H - 40);
            }
            ctx.restore();

            // scene cut: horizontal slices of the frame slide sideways
            if (tear > 0) {
                for (let k = 0; k < 6; k++) {
                    const y = Math.random() * H, h = 8 + Math.random() * 40, dx = (Math.random() - 0.5) * 60 * (tear / 9);
                    ctx.drawImage(canvas, 0, y * dpr, W * dpr, h * dpr, dx, y, W, h);
                }
                tear--;
            }
            // glass: dark edge falloff, fine scanlines, soft specular
            const v = ctx.createRadialGradient(W * 0.48, H * 0.5, H * 0.22, W * 0.48, H * 0.5, H * 0.62);
            v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.6)");
            ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = "rgba(0,0,0,0.12)"; for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
            const sp = ctx.createLinearGradient(W * 0.2, H * 0.1, W * 0.55, H * 0.45);
            sp.addColorStop(0, "rgba(255,255,255,0.16)"); sp.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = sp; ctx.beginPath(); ctx.ellipse(W * 0.34, H * 0.26, W * 0.26, H * 0.16, -0.5, 0, Math.PI * 2); ctx.fill();
        };
        raf = requestAnimationFrame(frame);
        return () => { cancelAnimationFrame(raf); io.disconnect(); };
    }, [signal, active]);

    return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
}
