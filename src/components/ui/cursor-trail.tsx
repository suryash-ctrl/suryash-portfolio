"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionPreference } from "@/components/layout/motion-preference";

/** A small spring-physics ring that trails the pointer across the whole
 *  page. Interruptible (a real spring, not a tween), off for touch, under
 *  prefers-reduced-motion, and via the manual motion toggle in the hero HUD.
 *
 *  Full `motion` import, not `m`: x/y here are driven by a native `window`
 *  pointermove listener outside React's event system, and the rest of the
 *  app's `m` + LazyMotion(strict) setup never subscribes the element to
 *  those motion-value updates unless the component also takes a
 *  LazyMotion-recognized gesture prop (whileHover etc.) directly — verified
 *  by testing: under `m` the transform stayed frozen at its initial value
 *  no matter how the pointer moved. */
export function CursorTrail() {
    const { enabled } = useMotionPreference();
    const [isCoarsePointer, setIsCoarsePointer] = useState(true);
    const [active, setActive] = useState(false);
    const [pressed, setPressed] = useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
    const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

    useEffect(() => {
        setIsCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
    }, []);

    useEffect(() => {
        if (!enabled || isCoarsePointer) return;

        const move = (e: PointerEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
            if (!active) setActive(true);
        };
        const down = () => setPressed(true);
        const up = () => setPressed(false);
        const leave = () => setActive(false);

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerdown", down);
        window.addEventListener("pointerup", up);
        document.documentElement.addEventListener("mouseleave", leave);

        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerdown", down);
            window.removeEventListener("pointerup", up);
            document.documentElement.removeEventListener("mouseleave", leave);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, isCoarsePointer]);

    if (!enabled || isCoarsePointer) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-accent-primary mix-blend-difference"
            style={{
                x: ringX,
                y: ringY,
                translateX: "-50%",
                translateY: "-50%",
                width: 22,
                height: 22,
            }}
            animate={{
                scale: pressed ? 0.65 : 1,
                opacity: active ? 0.7 : 0,
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
    );
}
