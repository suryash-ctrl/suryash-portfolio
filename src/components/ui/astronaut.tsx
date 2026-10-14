"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useMotionPreference } from "@/components/layout/motion-preference";

/** A slowly counter-rotating pair of triangles behind the astronaut — a
 *  quiet sacred-geometry echo, glowing in the site's own accent colour. */
function GeometryHalo() {
    return (
        <motion.svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2"
            style={{ x: "-50%", y: "-50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
            <polygon points="75,14 128,108 22,108" stroke="var(--accent-primary)" strokeWidth="0.75" opacity="0.4" />
            <polygon points="75,136 22,42 128,42" stroke="var(--accent-primary)" strokeWidth="0.75" opacity="0.25" />
        </motion.svg>
    );
}

/** Original geometric EVA-suit illustration — no photo, no stock art.
 *  Muted gunmetal suit, opaque visor, visible tubing — a quieter, more
 *  atmospheric read than a cartoon mascot. */
function AstronautSvg() {
    return (
        <svg width="80" height="104" viewBox="0 0 84 110" fill="none" aria-hidden="true" className="relative drop-shadow-[0_0_14px_rgba(0,0,0,0.5)]">
            {/* backpack (PLSS) */}
            <rect x="24" y="38" width="36" height="42" rx="7" fill="#5c6670" stroke="#2c333b" strokeWidth="1.25" />
            <line x1="30" y1="46" x2="30" y2="74" stroke="#2c333b" strokeWidth="0.75" opacity="0.6" />
            <line x1="54" y1="46" x2="54" y2="74" stroke="#2c333b" strokeWidth="0.75" opacity="0.6" />

            {/* oxygen tubing from backpack to collar */}
            <path d="M28 40c-2-6 1-10 4-12" stroke="#2c333b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M56 40c2-6-1-10-4-12" stroke="#2c333b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* suit body */}
            <path
                d="M24 46c0-10 8-16 18-16s18 6 18 16v24c0 10-8 18-18 18s-18-8-18-18z"
                fill="#8a93a0"
                stroke="#30363f"
                strokeWidth="1.5"
            />
            <path d="M42 32v54" stroke="#6b7480" strokeWidth="0.75" opacity="0.7" />

            {/* chest control module */}
            <rect x="33" y="48" width="18" height="12" rx="2" fill="#434b55" stroke="#20252b" strokeWidth="1" />
            <circle cx="37" cy="54" r="1.4" fill="var(--accent-primary)" />
            <circle cx="42" cy="54" r="1.4" fill="var(--accent-secondary)" />
            <circle cx="47" cy="54" r="1.4" fill="var(--accent-primary)" />

            {/* arms */}
            <path d="M24 44c-8 2-13 9-12 18 1 6 5 10 10 11" stroke="#30363f" strokeWidth="1.5" fill="#8a93a0" />
            <path d="M60 44c8 2 13 10 11 19-1 6-5 9-10 10" stroke="#30363f" strokeWidth="1.5" fill="#8a93a0" />

            {/* gloves */}
            <circle cx="21" cy="73" r="5" fill="#434b55" stroke="#20252b" strokeWidth="1.5" />
            <circle cx="62" cy="74" r="5" fill="#434b55" stroke="#20252b" strokeWidth="1.5" />

            {/* legs */}
            <path d="M33 78l-3 24c0 3 2 5 5 5s5-2 5-5l1-22" fill="#8a93a0" stroke="#30363f" strokeWidth="1.5" />
            <path d="M51 78l3 24c0 3-2 5-5 5s-5-2-5-5l-1-22" fill="#8a93a0" stroke="#30363f" strokeWidth="1.5" />

            {/* boots */}
            <rect x="28" y="100" width="11" height="7" rx="2" fill="#2c333b" stroke="#17191d" strokeWidth="1.2" />
            <rect x="45" y="100" width="11" height="7" rx="2" fill="#2c333b" stroke="#17191d" strokeWidth="1.2" />

            {/* collar ring */}
            <rect x="29" y="27" width="26" height="7" rx="3.5" fill="#434b55" stroke="#20252b" strokeWidth="1.2" />

            {/* helmet */}
            <circle cx="42" cy="18" r="19" fill="#9aa2ad" stroke="#2c333b" strokeWidth="1.5" />

            {/* visor — near-opaque, a single cool highlight arc instead of a colour gradient */}
            <ellipse cx="42" cy="18" rx="13.5" ry="12.5" fill="#0a0c10" />
            <path d="M31 10c3-4 8-6 13-5" stroke="#c7d6e3" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" fill="none" />
            <ellipse cx="36" cy="14" rx="3.2" ry="2.2" fill="#ffffff" opacity="0.18" />
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
            className="pointer-events-none fixed top-0 left-0 z-40"
            animate={{
                x: ["6vw", "68vw", "40vw", "82vw", "6vw"],
                y: ["12vh", "32vh", "62vh", "22vh", "12vh"],
                rotate: [-6, 12, -14, 8, -6],
            }}
            transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="relative flex items-center justify-center">
                <GeometryHalo />
                <motion.div
                    className="relative"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <AstronautSvg />
                </motion.div>
            </div>
        </motion.div>
    );
}
