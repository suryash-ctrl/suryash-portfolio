"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/layout/motion-preference";

/** A fixed, full-page point cloud that morphs between shapes as the page
 *  scrolls — sphere → ring → wave field → double helix → sphere — rotating
 *  with scroll, tilting toward the cursor, and pushing points away from the
 *  pointer. Plain 2D canvas with a hand-rolled perspective projection. */

const N = 2600;
type Shape = Float32Array; // xyz triples, roughly in -1..1

function sphere(): Shape {
    const out = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = golden * i;
        out[i * 3] = Math.cos(t) * r;
        out[i * 3 + 1] = y;
        out[i * 3 + 2] = Math.sin(t) * r;
    }
    return out;
}

function torus(): Shape {
    const out = new Float32Array(N * 3);
    const R = 0.85, r = 0.3;
    for (let i = 0; i < N; i++) {
        const u = (i / N) * Math.PI * 2 * 1;
        const v = ((i * 37) % N) / N * Math.PI * 2;
        out[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
        out[i * 3 + 1] = r * Math.sin(v);
        out[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
    }
    return out;
}

function plane(): Shape {
    const out = new Float32Array(N * 3);
    const side = Math.ceil(Math.sqrt(N));
    for (let i = 0; i < N; i++) {
        const gx = (i % side) / (side - 1);
        const gz = Math.floor(i / side) / (side - 1);
        out[i * 3] = (gx - 0.5) * 2.4;
        out[i * 3 + 1] = 0;
        out[i * 3 + 2] = (gz - 0.5) * 2.4;
    }
    return out;
}

function helix(): Shape {
    const out = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const strand = i % 2;
        const t = (i / N) * Math.PI * 7;
        const jitter = (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.12;
        out[i * 3] = Math.cos(t + strand * Math.PI) * (0.55 + jitter);
        out[i * 3 + 1] = (i / N - 0.5) * 2.2;
        out[i * 3 + 2] = Math.sin(t + strand * Math.PI) * (0.55 + jitter);
    }
    return out;
}

// stage colours, rgb
const COLORS: [number, number, number][] = [
    [236, 240, 244], // white
    [96, 214, 198], // teal
    [240, 184, 96], // amber
    [176, 156, 255], // violet
    [236, 240, 244], // white
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { enabled: motionEnabled } = useMotionPreference();

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;
        const canvas: HTMLCanvasElement = canvasEl;
        const ctxEl = canvas.getContext("2d");
        if (!ctxEl) return;
        const ctx: CanvasRenderingContext2D = ctxEl;

        const shapes = [sphere(), torus(), plane(), helix(), sphere()];
        const pointer = { x: -9999, y: -9999, nx: 0, ny: 0 };
        const tilt = { x: 0, y: 0 };
        let w = 0, h = 0, dpr = 1, frame = 0;
        const start = performance.now();

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e: PointerEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.nx = (e.clientX / w) * 2 - 1;
            pointer.ny = (e.clientY / h) * 2 - 1;
        };
        const onLeave = () => {
            pointer.x = pointer.y = -9999;
            pointer.nx = pointer.ny = 0;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);

        function draw(now: number) {
            const time = motionEnabled ? (now - start) / 1000 : 0;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
            const p = clamp(window.scrollY / maxScroll, 0, 1);
            const heroOut = clamp((window.scrollY / h - 0.35) / 0.8, 0, 1); // 0 in hero, 1 once past it

            // morph stage
            const seg = p * (shapes.length - 1);
            const si = Math.min(shapes.length - 2, Math.floor(seg));
            const st = ease(clamp(seg - si, 0, 1));
            const A = shapes[si], B = shapes[si + 1];
            const ca = COLORS[si], cb = COLORS[si + 1];
            const col = ca.map((c, k) => Math.round(c + (cb[k] - c) * st));

            // placement: centred in the hero, then off to the side (wide screens)
            const wide = w >= 1100;
            const heroR = Math.min(w, h) * (w < 900 ? 0.15 : 0.155);
            const sideR = Math.min(w, h) * (wide ? 0.3 : 0.34);
            const R = heroR + (sideR - heroR) * ease(heroOut);
            const cx = w / 2 + (wide ? w * 0.3 : 0) * ease(heroOut);
            const cy = h / 2;
            const baseAlpha = 1 - (wide ? 0.5 : 0.72) * ease(heroOut);

            // rotation: idle spin + scroll-linked turn, eased tilt toward the cursor
            tilt.x += (pointer.ny * 0.35 - tilt.x) * 0.06;
            tilt.y += (pointer.nx * 0.5 - tilt.y) * 0.06;
            const ry = time * 0.18 + p * Math.PI * 4 + tilt.y;
            const rx = 0.32 + tilt.x;
            const cosY = Math.cos(ry), sinY = Math.sin(ry);
            const cosX = Math.cos(rx), sinX = Math.sin(rx);
            const fov = 3.2;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;

            for (let i = 0; i < N; i++) {
                const j = i * 3;
                let x = A[j] + (B[j] - A[j]) * st;
                let y = A[j + 1] + (B[j + 1] - A[j + 1]) * st;
                let z = A[j + 2] + (B[j + 2] - A[j + 2]) * st;

                // organic wobble — strongest on the spheres, a travelling ripple on the plane
                const wob = Math.sin(x * 3.1 + time * 1.2) * Math.cos(z * 2.7 + time * 0.9) * 0.05;
                x += x * wob;
                y += y * wob + (si === 1 || si === 2 ? Math.sin(x * 2.4 + z * 1.8 + time * 1.4) * 0.16 * (si === 2 ? 1 - st : st) : 0);
                z += z * wob;

                // rotate Y then X
                const x1 = x * cosY - z * sinY;
                const z1 = x * sinY + z * cosY;
                const y1 = y * cosX - z1 * sinX;
                const z2 = y * sinX + z1 * cosX;

                const persp = fov / (fov + z2);
                let sx = cx + x1 * R * persp;
                let sy = cy + y1 * R * persp;

                // pointer repel, in screen space
                const dx = sx - pointer.x, dy = sy - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 9000) {
                    const d = Math.sqrt(d2) || 1;
                    const push = (1 - d / 95) * 26;
                    sx += (dx / d) * push;
                    sy += (dy / d) * push;
                }

                const depth = clamp((1 - z2) / 2, 0, 1); // 1 = nearest
                ctx.globalAlpha = baseAlpha * (0.18 + 0.82 * depth);
                const s = 0.7 + depth * 1.1;
                ctx.fillRect(sx, sy, s, s);
            }
            ctx.globalAlpha = 1;
            frame = requestAnimationFrame(draw);
        }

        const onVisibility = () => {
            cancelAnimationFrame(frame);
            if (!document.hidden) frame = requestAnimationFrame(draw);
        };
        document.addEventListener("visibilitychange", onVisibility);
        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [motionEnabled]);

    return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1]" />;
}
