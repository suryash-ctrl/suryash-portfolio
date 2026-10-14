"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useMotionPreference } from "@/components/layout/motion-preference";

/** Original geometric EVA-suit illustration — no photo, no stock art.
 *  Drifts and slowly tumbles across the viewport like zero-gravity motion. */
function AstronautSvg() {
    return (
        <svg width="84" height="110" viewBox="0 0 84 110" fill="none" aria-hidden="true">
            {/* backpack (PLSS) */}
            <rect x="24" y="38" width="36" height="42" rx="8" fill="#d8dee6" stroke="#9aa5b1" strokeWidth="1.5" />
            {/* suit body */}
            <path
                d="M24 46c0-10 8-16 18-16s18 6 18 16v24c0 10-8 18-18 18s-18-8-18-18z"
                fill="#f4f6f8"
                stroke="#9aa5b1"
                strokeWidth="1.5"
            />
            {/* chest control module */}
            <rect x="33" y="48" width="18" height="12" rx="2" fill="#e3e8ed" stroke="#9aa5b1" strokeWidth="1" />
            <circle cx="37" cy="54" r="1.6" fill="var(--accent-primary)" />
            <circle cx="42" cy="54" r="1.6" fill="var(--accent-tertiary)" />
            <circle cx="47" cy="54" r="1.6" fill="var(--accent-primary)" />
            {/* arms */}
            <path d="M24 44c-8 2-13 9-12 18 1 6 5 10 10 11" stroke="#9aa5b1" strokeWidth="1.5" fill="#f4f6f8" />
            <path d="M60 44c8 2 13 10 11 19-1 6-5 9-10 10" stroke="#9aa5b1" strokeWidth="1.5" fill="#f4f6f8" />
            {/* gloves */}
            <circle cx="21" cy="73" r="5" fill="#e3e8ed" stroke="#9aa5b1" strokeWidth="1.5" />
            <circle cx="62" cy="74" r="5" fill="#e3e8ed" stroke="#9aa5b1" strokeWidth="1.5" />
            {/* legs */}
            <path d="M33 78l-3 24c0 3 2 5 5 5s5-2 5-5l1-22" fill="#f4f6f8" stroke="#9aa5b1" strokeWidth="1.5" />
            <path d="M51 78l3 24c0 3-2 5-5 5s-5-2-5-5l-1-22" fill="#f4f6f8" stroke="#9aa5b1" strokeWidth="1.5" />
            {/* boots */}
            <rect x="28" y="100" width="11" height="7" rx="2" fill="#d8dee6" stroke="#9aa5b1" strokeWidth="1.2" />
            <rect x="45" y="100" width="11" height="7" rx="2" fill="#d8dee6" stroke="#9aa5b1" strokeWidth="1.2" />
            {/* collar ring */}
            <rect x="29" y="27" width="26" height="7" rx="3.5" fill="#c7cfd8" stroke="#9aa5b1" strokeWidth="1.2" />
            {/* helmet */}
            <circle cx="42" cy="18" r="19" fill="#eef1f4" stroke="#9aa5b1" strokeWidth="1.5" />
            {/* visor, reflective */}
            <ellipse cx="42" cy="18" rx="13" ry="12" fill="url(#visorGradient)" />
            <ellipse cx="37" cy="13" rx="4" ry="3" fill="#ffffff" opacity="0.55" />
            <defs>
                <linearGradient id="visorGradient" x1="29" y1="6" x2="55" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--accent-secondary)" />
                    <stop offset="55%" stopColor="#0c1326" />
                    <stop offset="100%" stopColor="var(--accent-primary)" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function Astronaut() {
    const { enabled: spaceOn } = useSpaceMode();
    const { enabled: motionEnabled } = useMotionPreference();

    if (!spaceOn || !motionEnabled) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-40 drop-shadow-[0_0_18px_rgba(79,179,217,0.25)]"
            animate={{
                x: ["6vw", "68vw", "40vw", "82vw", "6vw"],
                y: ["12vh", "32vh", "62vh", "22vh", "12vh"],
                rotate: [-6, 12, -14, 8, -6],
            }}
            transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <AstronautSvg />
            </motion.div>
        </motion.div>
    );
}
