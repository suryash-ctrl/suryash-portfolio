"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";
import { useMotionPreference } from "@/components/layout/motion-preference";
import { useParallax } from "@/components/layout/parallax";

/** A small original solar system — sun, two planets on implied orbits, a
 *  moon, and the orbit rings themselves — pure CSS gradients and SVG, no
 *  stock art. Each piece drifts on its own slow path and reacts a little
 *  to the pointer (distant pieces move less — real parallax depth). */
export function Planets() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time } = useSpaceTime();
    const { enabled: motionEnabled } = useMotionPreference();
    const sunParallax = useParallax(4);
    const rustyParallax = useParallax(14);
    const ringedParallax = useParallax(10);
    const moonParallax = useParallax(20);

    if (!spaceOn || time !== "night") return null;

    return (
        <>
            {/* Sun — the system's anchor, upper-left, mostly still */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[4]"
                style={{ x: sunParallax.x, y: sunParallax.y, transform: "translate(10vw, 14vh)" }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: 30,
                        height: 30,
                        background: "radial-gradient(circle at 38% 35%, #fff7e0 0%, #ffd27a 45%, #ff9d3d 80%, #c9661a 100%)",
                        boxShadow: "0 0 40px 14px rgba(255, 180, 90, 0.35), 0 0 90px 30px rgba(255, 150, 60, 0.12)",
                    }}
                />
                {/* implied orbit rings around the sun */}
                <div
                    className="absolute rounded-full"
                    style={{
                        left: 15,
                        top: 15,
                        width: 230,
                        height: 150,
                        transform: "translate(-50%, -50%) rotate(-8deg)",
                        border: "1px dashed rgba(255, 220, 180, 0.14)",
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        left: 15,
                        top: 15,
                        width: 380,
                        height: 250,
                        transform: "translate(-50%, -50%) rotate(-8deg)",
                        border: "1px dashed rgba(255, 220, 180, 0.09)",
                    }}
                />
            </motion.div>

            {/* Rusty small planet, upper right */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[5]"
                style={{ x: rustyParallax.x, y: rustyParallax.y }}
            >
                <motion.div
                    animate={
                        motionEnabled
                            ? { x: ["78vw", "70vw", "84vw", "78vw"], y: ["8vh", "22vh", "14vh", "8vh"] }
                            : undefined
                    }
                    style={!motionEnabled ? { transform: "translate(78vw, 8vh)" } : undefined}
                    transition={{ duration: 70, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div
                        className="rounded-full"
                        style={{
                            width: 46,
                            height: 46,
                            background: "radial-gradient(circle at 32% 30%, #e8a87c 0%, #c4663a 38%, #7a3420 75%, #3d1810 100%)",
                            boxShadow: "inset -8px -8px 16px rgba(0,0,0,0.5), 0 0 24px rgba(196,102,58,0.25)",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Larger ringed planet, bottom edge — kept low so it never
                drifts over the hero/bio copy on a narrow single-column
                mobile layout — with a small moon drifting near it */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[5] opacity-80"
                style={{ x: ringedParallax.x, y: ringedParallax.y }}
            >
                <motion.div
                    className="relative"
                    animate={
                        motionEnabled
                            ? { x: ["2vw", "8vw", "0vw", "2vw"], y: ["90vh", "84vh", "88vh", "90vh"] }
                            : undefined
                    }
                    style={!motionEnabled ? { transform: "translate(2vw, 90vh)" } : undefined}
                    transition={{ duration: 95, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="relative" style={{ width: 92, height: 92 }}>
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: 150,
                                height: 150,
                                transform: "translate(-50%, -50%) rotate(-18deg)",
                                borderRadius: "50%",
                                border: "7px solid rgba(154, 180, 196, 0.35)",
                                borderTopColor: "rgba(154, 180, 196, 0.12)",
                                boxShadow: "0 0 18px rgba(124, 160, 184, 0.15)",
                            }}
                        />
                        <div
                            className="absolute left-1/2 top-1/2 rounded-full"
                            style={{
                                width: 70,
                                height: 70,
                                transform: "translate(-50%, -50%)",
                                background: "radial-gradient(circle at 34% 30%, #aebfd6 0%, #6f84a3 42%, #3c4a63 78%, #1c2432 100%)",
                                boxShadow: "inset -10px -10px 18px rgba(0,0,0,0.55), 0 0 30px rgba(111,132,163,0.2)",
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Small moon, independent slow orbit-ish drift */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[5]"
                style={{ x: moonParallax.x, y: moonParallax.y }}
            >
                <motion.div
                    animate={
                        motionEnabled
                            ? { x: ["42vw", "50vw", "46vw", "42vw"], y: ["78vh", "70vh", "82vh", "78vh"] }
                            : undefined
                    }
                    style={!motionEnabled ? { transform: "translate(42vw, 78vh)" } : undefined}
                    transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div
                        className="rounded-full"
                        style={{
                            width: 18,
                            height: 18,
                            background: "radial-gradient(circle at 35% 30%, #e4e4e4 0%, #aaa 45%, #777 80%, #444 100%)",
                            boxShadow: "inset -4px -4px 7px rgba(0,0,0,0.5)",
                        }}
                    />
                </motion.div>
            </motion.div>
        </>
    );
}
