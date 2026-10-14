"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";
import { useMotionPreference } from "@/components/layout/motion-preference";
import { useParallax } from "@/components/layout/parallax";

const CLOUDS = [
    { top: "10vh", width: 140, height: 44, duration: 110, delay: 0 },
    { top: "22vh", width: 90, height: 30, duration: 140, delay: -40 },
    { top: "6vh", width: 70, height: 24, duration: 95, delay: -70 },
];

function Cloud({ top, width, height, duration, delay }: (typeof CLOUDS)[number]) {
    const { enabled: motionEnabled } = useMotionPreference();
    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 z-[1] rounded-full"
            style={{
                top,
                width,
                height,
                background: "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
                filter: "blur(2px)",
            }}
            animate={motionEnabled ? { x: ["-15vw", "115vw"] } : undefined}
            transition={{ duration, repeat: Infinity, ease: "linear", delay }}
        />
    );
}

/** Warm golden-hour sky, a glowing sun, and a few drifting clouds — the
 *  "day" counterpart to the night starfield, all CSS/SVG, no photo. */
export function DaySky() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time } = useSpaceTime();
    const sunParallax = useParallax(6);

    if (!spaceOn || time !== "day") return null;

    return (
        <>
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: "linear-gradient(180deg, #bfe0f2 0%, #cdeaf0 28%, #f6dfae 58%, #f3c589 78%, #e9a96b 100%)",
                }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed z-[1] rounded-full"
                style={{
                    top: "10vh",
                    left: "68vw",
                    width: 70,
                    height: 70,
                    x: sunParallax.x,
                    y: sunParallax.y,
                    background: "radial-gradient(circle at 38% 35%, #fffdf2 0%, #ffe9a8 45%, #ffcf6b 80%, #f2a73e 100%)",
                    boxShadow: "0 0 70px 26px rgba(255, 221, 140, 0.55), 0 0 140px 50px rgba(255, 200, 110, 0.22)",
                }}
            />
            {CLOUDS.map((c, i) => (
                <Cloud key={i} {...c} />
            ))}
        </>
    );
}
