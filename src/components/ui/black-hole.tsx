"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";
import { useMotionPreference } from "@/components/layout/motion-preference";
import { useParallax } from "@/components/layout/parallax";

/** A black hole in the corner — dark core, glowing accretion disk, pure CSS
 *  gradients. Parked in one spot (big set-pieces don't need to roam the way
 *  the astronaut does) with only the disk itself rotating. Barely reacts to
 *  the pointer — it's the most distant, most massive thing in the scene. */
export function BlackHole() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time } = useSpaceTime();
    const { enabled: motionEnabled } = useMotionPreference();
    const parallax = useParallax(3);

    if (!spaceOn || time !== "night") return null;

    // Proportional to viewport so it stays a corner accent rather than
    // crowding reading content on a narrow phone screen.
    const size = "clamp(150px, 24vw, 260px)";

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed z-[5] opacity-70"
            style={{ right: "-8vw", bottom: "-8vh", width: size, height: size, x: parallax.x, y: parallax.y }}
        >
            {/* outer glow */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(255,186,120,0.18) 0%, rgba(120,90,220,0.1) 45%, transparent 72%)",
                    filter: "blur(6px)",
                }}
            />

            {/* accretion disk */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    inset: "14%",
                    background:
                        "conic-gradient(from 0deg, #2a1206 0deg, #ffb066 60deg, #fff3d6 110deg, #8fd0ff 150deg, #2a1206 200deg, #2a1206 360deg)",
                    filter: "blur(2px)",
                    maskImage: "radial-gradient(circle, transparent 38%, black 42%, black 92%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle, transparent 38%, black 42%, black 92%, transparent 100%)",
                }}
                animate={motionEnabled ? { rotate: 360 } : undefined}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* event horizon — pure black core */}
            <div
                className="absolute rounded-full"
                style={{ inset: "32%", background: "#000", boxShadow: "0 0 20px 6px rgba(0,0,0,0.8)" }}
            />
        </motion.div>
    );
}
