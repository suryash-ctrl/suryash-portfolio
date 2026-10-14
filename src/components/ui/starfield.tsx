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
}

const STAR_COUNT = 220;

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
            starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.3 + 0.3,
                baseAlpha: Math.random() * 0.5 + 0.35,
                twinkleSpeed: Math.random() * 0.6 + 0.2,
                phase: Math.random() * Math.PI * 2,
            }));
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

        function drawStatic() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            paintBackground(ctx, w, h);
            for (const s of starsRef.current) {
                ctx.globalAlpha = s.baseAlpha;
                ctx.fillStyle = "#eef3ff";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        function tick(t: number) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            paintBackground(ctx, w, h);
            for (const s of starsRef.current) {
                const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.phase);
                ctx.globalAlpha = s.baseAlpha * (0.4 + 0.6 * twinkle);
                ctx.fillStyle = "#eef3ff";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
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
    const gradient = ctx.createRadialGradient(w * 0.5, h * 0.25, 0, w * 0.5, h * 0.25, Math.max(w, h) * 0.9);
    gradient.addColorStop(0, "#0c1326");
    gradient.addColorStop(0.55, "#070a16");
    gradient.addColorStop(1, "#030308");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
}
