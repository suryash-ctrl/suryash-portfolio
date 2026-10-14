"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";
import { useMotionPreference } from "@/components/layout/motion-preference";
import { useParallax } from "@/components/layout/parallax";

interface AsteroidSpec {
    points: string;
    size: number;
    path: { x: string[]; y: string[] };
    duration: number;
    fill: string;
}

/** Small irregular rocks, each an original hand-built polygon (no stock
 *  art), drifting past at a faster pace than the planets — closer objects
 *  read as closer by moving faster, same logic as a parallax background. */
const ASTEROIDS: AsteroidSpec[] = [
    {
        points: "0,8 6,0 14,2 16,9 10,15 3,14",
        size: 16,
        path: { x: ["-5vw", "40vw", "100vw"], y: ["18vh", "26vh", "34vh"] },
        duration: 38,
        fill: "#6b6358",
    },
    {
        points: "0,5 5,0 11,1 12,7 7,11 2,10",
        size: 12,
        path: { x: ["105vw", "60vw", "-5vw"], y: ["55vh", "48vh", "40vh"] },
        duration: 46,
        fill: "#80766a",
    },
    {
        points: "0,6 7,0 13,3 12,10 5,13 0,10",
        size: 13,
        path: { x: ["-5vw", "45vw", "105vw"], y: ["85vh", "78vh", "70vh"] },
        duration: 55,
        fill: "#716a5f",
    },
    {
        points: "0,4 4,0 9,1 10,6 6,9 1,8",
        size: 9,
        path: { x: ["102vw", "55vw", "-5vw"], y: ["10vh", "16vh", "20vh"] },
        duration: 33,
        fill: "#8c8276",
    },
];

function Asteroid({ a, index }: { a: AsteroidSpec; index: number }) {
    const parallax = useParallax(24);
    return (
        <motion.div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[5]" style={{ x: parallax.x, y: parallax.y }}>
            <motion.div
                animate={{ x: a.path.x, y: a.path.y, rotate: [0, 180, 360] }}
                transition={{ duration: a.duration, repeat: Infinity, ease: "linear", delay: index * 3 }}
            >
                <svg width={a.size} height={a.size} viewBox="0 0 16 16" aria-hidden="true">
                    <polygon points={a.points} fill={a.fill} stroke="#352f28" strokeWidth="0.6" />
                </svg>
            </motion.div>
        </motion.div>
    );
}

export function Asteroids() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time } = useSpaceTime();
    const { enabled: motionEnabled } = useMotionPreference();

    if (!spaceOn || !motionEnabled || time !== "night") return null;

    return (
        <>
            {ASTEROIDS.map((a, i) => (
                <Asteroid key={i} a={a} index={i} />
            ))}
        </>
    );
}
