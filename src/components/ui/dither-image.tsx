"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
    bayerDither,
    invertWithMask,
} from "@/lib/dither-algorithms";
import { processImage, loadImage } from "@/lib/image-processing";
import {
    createDotSystem,
    updateDots,
    renderDots,
    type DotSystem,
    type Shockwave,
} from "@/lib/particle-system";
import { useIsMobile } from "@/lib/use-is-mobile";

interface DitherImageProps {
    src: string;
    className?: string;
    /** "theme" tints every dot with the theme's ink colour, which is what a
     *  two-tone line drawing wants. "source" gives each dot the colour of the
     *  pixel underneath it, which is what a photograph wants. */
    colorMode?: "theme" | "source";
    /** source mode only: 0 keeps the photo's own colour, higher values push it */
    saturate?: number;
    /** source mode only: multiplies lightness, to lift a dark image off a dark ground */
    lift?: number;
    /** CONFIG.invert is right for a two-tone stencil and wrong for a photograph,
     *  where it punches holes through the brightest areas.
     *  "auto" inverts in light mode only: the gaps between dots are the page,
     *  so on a dark ground they read as shadow and on a light ground they read
     *  as highlight. Without the flip a photo's tones inverse when the theme does. */
    invert?: boolean | "auto";
    /** luma cutoff for placing a dot; lower keeps more of a photo's highlights */
    threshold?: number;
    /** dot grid resolution. Higher resolves more detail at more dots. */
    gridSize?: number;
    /** source blur before sampling. A stencil wants softening, a photo does not. */
    blur?: number;
    /** tone curve applied before dithering */
    gamma?: number;
    contrast?: number;
    /** Drop dots that match the page and so cannot be seen. "auto" culls
     *  shadows on a dark ground and highlights on a light one, which is what
     *  keeps the image reading as something made of dots rather than filling
     *  in solid at whichever end matches the background. */
    cull?: "dark" | "light" | "none" | "auto";
    /** 0..255 luma cutoff for cull */
    cullAt?: number;
}

const CONFIG = {
    gridSize: 205,
    scale: 0.80,
    dotScale: 0.5,
    invert: true,
    threshold: 127,
    contrast: 100,
    gamma: 1.03,
    blur: 3.75,
    highlightsCompression: 0.00,
    cornerRadius: 0.00,
} as const;

export function DitherImage({
    src,
    className,
    colorMode = "theme",
    saturate = 0,
    lift = 1,
    invert = CONFIG.invert,
    threshold = CONFIG.threshold,
    gridSize = CONFIG.gridSize,
    blur = CONFIG.blur,
    gamma = CONFIG.gamma,
    contrast = CONFIG.contrast,
    cull = "none",
    cullAt = 40,
}: DitherImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const systemRef = useRef<DotSystem | null>(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const shockwavesRef = useRef<Shockwave[]>([]);
    const animFrameRef = useRef<number>(0);
    const runningRef = useRef(false);
    const isMobile = useIsMobile();
    const { resolvedTheme } = useTheme();

    /* The render loop and the resize handler are long-lived closures built
       once, so they cannot see a later render's value; the current dot colour
       is mirrored into a ref for them to read. Writing that ref during render
       is an impure render, so the write lives in an effect. It is declared
       ahead of every effect that reads the ref and effects run in declaration
       order, so the mirror is current by the time they run. */
    const dotColorRef = useRef({ r: 232, g: 225, b: 215 });
    useEffect(() => {
        dotColorRef.current = resolvedTheme === "light"
            ? { r: 50, g: 42, b: 32 }     // #322a20 — warm dark brown
            : { r: 232, g: 225, b: 215 };  // #e8e1d7 — warm off-white
    }, [resolvedTheme]);

    const startLoop = useCallback(() => {
        if (runningRef.current) return;
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
            const needsMore = updateDots(
                sys,
                mouseRef.current.x,
                mouseRef.current.y,
                mouseRef.current.active,
                shockwavesRef.current,
                performance.now()
            );

            renderDots(ctx, sys, CONFIG.invert, rect.width, rect.height, dpr, dotColorRef.current);

            if (needsMore) {
                animFrameRef.current = requestAnimationFrame(tick);
            } else {
                runningRef.current = false;
            }
        };

        animFrameRef.current = requestAnimationFrame(tick);
    }, []);

    const rebuildParticles = useCallback(
        async (imgSrc: string) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const img = await loadImage(imgSrc);

            /* Everything below is one synchronous ~145ms pass over the pixel
               buffer. Run inline it lands in the middle of the load window and
               shows up as blocking time. Yielding first lets the browser finish
               painting and handle input; the work costs the same, it just stops
               holding up the frame. */
            await new Promise<void>((resolve) => {
                if (typeof requestIdleCallback === "function") {
                    requestIdleCallback(() => resolve(), { timeout: 300 });
                } else {
                    requestAnimationFrame(() => setTimeout(resolve, 0));
                }
            });
            if (!canvasRef.current) return;

            const processed = processImage(
                img,
                gridSize,
                1,
                contrast,
                gamma,
                blur,
                CONFIG.highlightsCompression
            );

            let positions = bayerDither(
                processed.grayscale,
                processed.width,
                processed.height,
                { threshold, serpentine: true, errorStrength: 1.0 },
                processed.alpha
            );

            const doInvert = invert === "auto" ? resolvedTheme === "light" : invert;
            if (doInvert) {
                positions = invertWithMask(
                    positions,
                    processed.width,
                    processed.height,
                    CONFIG.cornerRadius,
                    processed.alpha
                );
            }

            const gw = processed.width;
            const gh = processed.height;
            const s = Math.max(rect.width / gw, rect.height / gh);
            const ox = Math.round((rect.width - gw * s) / 2);
            const oy = Math.round((rect.height - gh * s) / 2);

            const dotScale = isMobile ? CONFIG.dotScale * 0.8 : CONFIG.dotScale;

            systemRef.current = createDotSystem(
                positions,
                s,
                dotScale,
                ox,
                oy,
                colorMode === "source"
                    ? {
                          rgb: processed.rgb,
                          gridW: processed.width,
                          saturate,
                          lift,
                          cull: cull === "auto" ? (resolvedTheme === "light" ? "light" : "dark") : cull,
                          cullAt,
                      }
                    : undefined
            );
            startLoop();
        },
        [isMobile, startLoop, colorMode, saturate, lift, invert, threshold, gridSize, blur, gamma, contrast, cull, cullAt, resolvedTheme]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;

        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        let lastWidth = 0;
        let lastHeight = 0;

        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const sys = systemRef.current;
            if (sys) renderDots(ctx, sys, CONFIG.invert, rect.width, rect.height, dpr, dotColorRef.current);

            const w = Math.round(rect.width);
            const h = Math.round(rect.height);
            if (lastWidth !== 0 && (w !== lastWidth || h !== lastHeight)) {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => rebuildParticles(src), 200);
            }
            lastWidth = w;
            lastHeight = h;
        };

        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas);

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

        const handlePointerCancel = () => {
            mouseRef.current.active = false;
            startLoop();
        };

        const handlePointerUp = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            shockwavesRef.current.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                start: performance.now(),
            });
            if (e.pointerType !== "mouse") {
                mouseRef.current.active = false;
            }
            startLoop();
        };

        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerleave", handlePointerLeave);
        canvas.addEventListener("pointercancel", handlePointerCancel);
        canvas.addEventListener("pointerup", handlePointerUp);

        rebuildParticles(src);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            runningRef.current = false;
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeObserver.disconnect();
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerleave", handlePointerLeave);
            canvas.removeEventListener("pointercancel", handlePointerCancel);
            canvas.removeEventListener("pointerup", handlePointerUp);
        };
    }, [startLoop, rebuildParticles, src]);

    /* Re-render dots when theme changes */
    useEffect(() => {
        const canvas = canvasRef.current;
        const sys = systemRef.current;
        if (!canvas || !sys) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        renderDots(ctx, sys, CONFIG.invert, rect.width, rect.height, dpr, dotColorRef.current);
    }, [resolvedTheme]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ touchAction: "none" }}
            role="img"
            aria-label="Interactive dithered avatar"
        />
    );
}
