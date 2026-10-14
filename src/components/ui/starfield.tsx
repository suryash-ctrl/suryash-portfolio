"use client";

import { useEffect, useRef } from "react";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useMotionPreference } from "@/components/layout/motion-preference";

interface Star {
    x: number;
    y: number;
    r: number;
    baseAlpha: number;
    twinkleSpeed: number;
    phase: number;
    color: string;
    glow: boolean;
}

const STAR_COUNT = 340;
const STAR_COLORS = ["#eef3ff", "#eef3ff", "#eef3ff", "#cfe0ff", "#ffe9d6", "#e3d6ff"];

export function Starfield() {
    const { enabled } = useSpaceMode();
    const { enabled: motionEnabled } = useMotionPreference();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!enabled) return;
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;
        const canvas: HTMLCanvasElement = canvasEl;
        const ctxEl = canvas.getContext("2d");
        if (!ctxEl) return;
        const ctx: CanvasRenderingContext2D = ctxEl;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        function buildStars(w: number, h: number) {
            starsRef.current = Array.from({ length: STAR_COUNT }, () => {
                const big = Math.random() < 0.06;
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: big ? Math.random() * 1.1 + 1.4 : Math.random() * 1.1 + 0.25,
                    baseAlpha: Math.random() * 0.5 + 0.35,
                    twinkleSpeed: Math.random() * 0.6 + 0.2,
                    phase: Math.random() * Math.PI * 2,
                    color: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0],
                    glow: big,
                };
            });
        }

        function resize() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildStars(w, h);
        }

        resize();
        window.addEventListener("resize", resize);

        function drawStars(t: number, animated: boolean) {
            for (const s of starsRef.current) {
                const twinkle = animated ? 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.phase) : 1;
                ctx.globalAlpha = s.baseAlpha * (0.4 + 0.6 * twinkle);
                ctx.fillStyle = s.color;
                if (s.glow) {
                    ctx.save();
                    ctx.shadowColor = s.color;
                    ctx.shadowBlur = 6;
                }
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                if (s.glow) ctx.restore();
            }
            ctx.globalAlpha = 1;
        }

        function drawStatic() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            paintBackground(ctx, w, h);
            drawStars(0, false);
        }

        function tick(t: number) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            paintBackground(ctx, w, h);
            drawStars(t, true);
            frameRef.current = requestAnimationFrame(tick);
        }

        if (motionEnabled) {
            frameRef.current = requestAnimationFrame(tick);
        } else {
            drawStatic();
        }

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [enabled, motionEnabled]);

    if (!enabled) return null;

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
        />
    );
}

function paintBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const base = ctx.createRadialGradient(w * 0.5, h * 0.25, 0, w * 0.5, h * 0.25, Math.max(w, h) * 0.9);
    base.addColorStop(0, "#0c1326");
    base.addColorStop(0.55, "#070a16");
    base.addColorStop(1, "#030308");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // Soft nebula colour washes — a few large, very low-alpha blobs.
    const blobs: [number, number, number, string][] = [
        [w * 0.18, h * 0.3, Math.max(w, h) * 0.42, "rgba(124, 92, 212, 0.10)"],
        [w * 0.82, h * 0.65, Math.max(w, h) * 0.46, "rgba(60, 140, 190, 0.09)"],
        [w * 0.55, h * 0.85, Math.max(w, h) * 0.38, "rgba(200, 90, 140, 0.06)"],
    ];
    for (const [bx, by, br, color] of blobs) {
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    }
}
