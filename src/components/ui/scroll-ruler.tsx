"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const TICKS = 61;

/** A drafting-ruler progress bar pinned to the bottom of the viewport: fine
 *  ticks every ~1.6%, major ticks every 10, a marker riding the scroll
 *  position, and a monospace readout of how far down and how far turned
 *  the particle field is. */
export function ScrollRuler() {
    const { scrollYProgress } = useScroll();
    const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
    const left = useTransform(smooth, (v) => `${v * 100}%`);
    const pct = useTransform(smooth, (v) => `${String(Math.round(v * 100)).padStart(3, "0")}%`);
    const deg = useTransform(smooth, (v) => `${Math.round(v * 720) % 360}°`);

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-16 bottom-3 z-40 hidden min-[640px]:block">
            <div className="relative h-3">
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between">
                    {Array.from({ length: TICKS }, (_, i) => (
                        <span key={i} className="block w-px bg-text-muted/40" style={{ height: i % 10 === 0 ? 10 : 5 }} />
                    ))}
                </div>
                <motion.span className="absolute bottom-0 block h-4 w-px bg-accent-primary" style={{ left }} />
            </div>
            <div className="mt-1 flex justify-end gap-4 font-jetbrains text-[9px] uppercase tracking-[0.2em] text-text-muted">
                <span>
                    scroll <motion.span className="text-text-secondary">{pct}</motion.span>
                </span>
                <span>
                    rotate <motion.span className="text-text-secondary">{deg}</motion.span>
                </span>
            </div>
        </div>
    );
}
