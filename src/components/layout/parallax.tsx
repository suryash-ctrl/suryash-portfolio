"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useMotionValue, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useMotionPreference } from "@/components/layout/motion-preference";

interface ParallaxContextValue {
    x: MotionValue<number>;
    y: MotionValue<number>;
}

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

/** Tracks pointer position once, globally, as two spring-smoothed motion
 *  values in -1..1 (centre of the viewport is 0,0). Every scenery layer
 *  reads from the same source instead of each attaching its own listener. */
export function ParallaxProvider({ children }: { children: React.ReactNode }) {
    const { enabled } = useMotionPreference();
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, { stiffness: 40, damping: 18, mass: 0.6 });
    const y = useSpring(rawY, { stiffness: 40, damping: 18, mass: 0.6 });
    const isCoarseRef = useRef(false);

    useEffect(() => {
        isCoarseRef.current = window.matchMedia("(pointer: coarse)").matches;
    }, []);

    useEffect(() => {
        if (!enabled) return;
        const move = (e: PointerEvent) => {
            if (isCoarseRef.current) return;
            rawX.set((e.clientX / window.innerWidth) * 2 - 1);
            rawY.set((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
    }, [enabled, rawX, rawY]);

    return <ParallaxContext.Provider value={{ x, y }}>{children}</ParallaxContext.Provider>;
}

/** depth: how strongly a layer reacts — small for distant objects (the
 *  black hole, far planets), larger for near ones (asteroids). Given in
 *  pixels of max travel in each direction. */
export function useParallax(depth: number) {
    const ctx = useContext(ParallaxContext);
    const fallbackX = useMotionValue(0);
    const fallbackY = useMotionValue(0);
    const sourceX = ctx?.x ?? fallbackX;
    const sourceY = ctx?.y ?? fallbackY;
    const offsetX = useTransform(sourceX, (v) => v * depth);
    const offsetY = useTransform(sourceY, (v) => v * depth);
    return { x: offsetX, y: offsetY };
}
