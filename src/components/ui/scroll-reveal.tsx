"use client";

import { m as motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const VARIANTS = {
    // lifts in from below out of a blur
    rise: { from: { opacity: 0, y: 90, filter: "blur(14px)" }, to: { opacity: 1, y: 0, filter: "blur(0px)" } },
    // opens like a shutter, top to bottom
    wipe: { from: { opacity: 0.2, clipPath: "inset(0% 0% 100% 0%)", y: 40 }, to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 } },
    // pushes forward out of the depth
    zoom: { from: { opacity: 0, scale: 0.9, y: 60, filter: "blur(10px)" }, to: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } },
    // slides in from the side
    slide: { from: { opacity: 0, x: -80, filter: "blur(10px)" }, to: { opacity: 1, x: 0, filter: "blur(0px)" } },
} as const;

/** Scroll transition wrapper: each section arrives with its own entrance
 *  instead of just being there. */
export function ScrollReveal({ children, variant = "rise" }: { children: React.ReactNode; variant?: keyof typeof VARIANTS }) {
    const v = VARIANTS[variant];
    return (
        <motion.div initial={v.from} whileInView={v.to} viewport={{ once: true, margin: "-12% 0px -8% 0px" }} transition={{ duration: 1.1, ease }}>
            {children}
        </motion.div>
    );
}
