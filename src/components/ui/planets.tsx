"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useMotionPreference } from "@/components/layout/motion-preference";

/** Two distant planets, pure CSS gradients — no images. Each drifts along
 *  its own slow independent path, far enough out that the motion reads as
 *  parallax rather than anything orbiting the astronaut. */
export function Planets() {
    const { enabled: spaceOn } = useSpaceMode();
    const { enabled: motionEnabled } = useMotionPreference();

    if (!spaceOn) return null;

    return (
        <>
            {/* Rusty small planet, upper right */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[5]"
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

            {/* Larger ringed planet, bottom edge — kept low so it never
                drifts over the hero/bio copy on a narrow single-column
                mobile layout */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[5] opacity-80"
                animate={
                    motionEnabled
                        ? { x: ["2vw", "8vw", "0vw", "2vw"], y: ["90vh", "84vh", "88vh", "90vh"] }
                        : undefined
                }
                style={!motionEnabled ? { transform: "translate(2vw, 90vh)" } : undefined}
                transition={{ duration: 95, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="relative" style={{ width: 92, height: 92 }}>
                    {/* ring (behind + in front of the sphere via two halves) */}
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
        </>
    );
}
