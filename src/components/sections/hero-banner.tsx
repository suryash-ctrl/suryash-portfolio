"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useTheme } from "next-themes";
import { createDotSystem, updateDots, renderDots, type DotSystem, type Shockwave } from "@/lib/particle-system";
import { useMotionPreference } from "@/components/layout/motion-preference";

const GRID_W = 160;
const GRID_H = 44;
const COLUMNS = 48;
const ROW_STEP = 1.15;

/** Deterministic "growth skyline" — an upward-trending bar pattern built
 *  from dots, standing in for the revenue/performance domain instead of a
 *  literal chart. Seeded, not random, so it is stable across re-renders. */
function buildSkylinePoints(): Float32Array {
    const colWidth = GRID_W / COLUMNS;
    const pts: number[] = [];

    for (let c = 0; c < COLUMNS; c++) {
        const t = c / (COLUMNS - 1);
        const trend = 0.35 + t * 0.55;
        const wave = Math.sin(c * 0.9) * 0.08 + Math.sin(c * 0.37 + 1.5) * 0.05;
        const seed = Math.sin(c * 12.9898) * 43758.5453;
        const jitter = (seed - Math.floor(seed)) * 0.12;
        const heightFrac = Math.min(0.95, Math.max(0.08, trend + wave + jitter));
        const rows = Math.max(1, Math.round((heightFrac * GRID_H) / ROW_STEP));
        const x = c * colWidth + colWidth / 2;

        for (let r = 0; r < rows; r++) {
            const y = GRID_H - r * ROW_STEP;
            pts.push(x, y);
        }
    }

    return new Float32Array(pts);
}

const SKYLINE_POINTS = buildSkylinePoints();

export function HeroBanner() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const systemRef = useRef<DotSystem | null>(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const shockwavesRef = useRef<Shockwave[]>([]);
    const animFrameRef = useRef<number>(0);
    const runningRef = useRef(false);
    const [revealed, setRevealed] = useState(false);
    const { resolvedTheme } = useTheme();
    const { enabled: motionEnabled } = useMotionPreference();

    const revealedRef = useRef(revealed);
    useEffect(() => {
        revealedRef.current = revealed;
    }, [revealed]);

    const colorFor = useCallback((reveal: boolean) => {
        const style = getComputedStyle(document.documentElement);
        const varName = reveal ? "--accent-primary" : "--text-muted";
        const probe = document.createElement("div");
        probe.style.color = style.getPropertyValue(varName).trim() || "currentColor";
        document.body.appendChild(probe);
        const rgb = getComputedStyle(probe).color;
        document.body.removeChild(probe);
        const match = rgb.match(/\d+/g);
        if (!match) return { r: 138, g: 143, b: 152 };
        return { r: Number(match[0]), g: Number(match[1]), b: Number(match[2]) };
    }, []);

    const drawOnce = useCallback(() => {
        const canvas = canvasRef.current;
        const sys = systemRef.current;
        if (!canvas || !sys) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        renderDots(ctx, sys, false, rect.width, rect.height, dpr, colorFor(revealedRef.current));
    }, [colorFor]);

    const startLoop = useCallback(() => {
        if (runningRef.current || !motionEnabled) return;
        runningRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;

        const tick = () => {
            const sys = systemRef.current;
            if (!sys) {
                runningRef.current = false;
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const needsMore = updateDots(sys, mouseRef.current.x, mouseRef.current.y, mouseRef.current.active, shockwavesRef.current, performance.now());
            renderDots(ctx, sys, false, rect.width, rect.height, dpr, colorFor(revealedRef.current));
            if (needsMore) {
                animFrameRef.current = requestAnimationFrame(tick);
            } else {
                runningRef.current = false;
            }
        };
        animFrameRef.current = requestAnimationFrame(tick);
    }, [colorFor, motionEnabled]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;

        const build = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const s = Math.max(rect.width / GRID_W, rect.height / GRID_H);
            const ox = (rect.width - GRID_W * s) / 2;
            const oy = (rect.height - GRID_H * s) / 2;
            systemRef.current = createDotSystem(SKYLINE_POINTS, s, 0.5, ox, oy);
            drawOnce();
        };

        build();
        const resizeObserver = new ResizeObserver(build);
        resizeObserver.observe(canvas);

        if (!motionEnabled) return () => resizeObserver.disconnect();

        const handlePointerMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
            startLoop();
        };
        const handlePointerLeave = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            mouseRef.current.active = false;
            startLoop();
        };
        const handlePointerUp = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            shockwavesRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, start: performance.now() });
            startLoop();
        };

        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerleave", handlePointerLeave);
        canvas.addEventListener("pointerup", handlePointerUp);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            runningRef.current = false;
            resizeObserver.disconnect();
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerleave", handlePointerLeave);
            canvas.removeEventListener("pointerup", handlePointerUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [motionEnabled, resolvedTheme]);

    useEffect(() => {
        drawOnce();
    }, [revealed, resolvedTheme, drawOnce]);

    return (
        <div
            className="relative h-[118px] cursor-pointer overflow-hidden border border-border-strong md:h-[134px]"
            onPointerEnter={(e) => e.pointerType === "mouse" && setRevealed(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setRevealed(false)}
            onClick={() => setRevealed((prev) => !prev)}
        >
            <canvas ref={canvasRef} className="block h-full w-full" style={{ touchAction: "none" }} aria-hidden="true" />
        </div>
    );
}
