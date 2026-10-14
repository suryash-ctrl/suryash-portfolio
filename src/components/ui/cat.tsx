"use client";

import { motion } from "framer-motion";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";
import { useMotionPreference } from "@/components/layout/motion-preference";
import { useParallax } from "@/components/layout/parallax";

/** Original orange tabby, side-on, sitting pose — tail swishes continuously,
 *  ears give an occasional twitch. No photo, no stock art. */
function CatSvg() {
    return (
        <motion.svg
            width="46"
            height="40"
            viewBox="0 0 46 40"
            fill="none"
            aria-hidden="true"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        >
            {/* tail — swishes around its base */}
            <motion.path
                d="M10 30c-6 2-9-3-7-8"
                stroke="#b5651d"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                style={{ transformOrigin: "10px 30px" }}
                animate={{ rotate: [0, 16, -6, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* body */}
            <ellipse cx="22" cy="28" rx="14" ry="10" fill="#c97a2b" />
            <ellipse cx="22" cy="28" rx="14" ry="10" fill="url(#catStripes)" opacity="0.5" />
            {/* head */}
            <circle cx="36" cy="18" r="9" fill="#c97a2b" />
            {/* ears */}
            <motion.polygon
                points="30,12 33,4 36,12"
                fill="#c97a2b"
                style={{ transformOrigin: "33px 12px" }}
                animate={{ rotate: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.polygon
                points="36,11 40,3 42,12"
                fill="#c97a2b"
                style={{ transformOrigin: "40px 11px" }}
                animate={{ rotate: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            {/* face */}
            <circle cx="39" cy="17" r="1.1" fill="#2a1a0d" />
            <circle cx="34" cy="17" r="1.1" fill="#2a1a0d" />
            <path d="M35 21c1 1 2 1 3 0" stroke="#5c3a1a" strokeWidth="0.9" strokeLinecap="round" fill="none" />
            {/* front legs */}
            <rect x="26" y="30" width="3.2" height="8" rx="1.5" fill="#b5651d" />
            <rect x="32" y="30" width="3.2" height="8" rx="1.5" fill="#b5651d" />
            <defs>
                <linearGradient id="catStripes" x1="8" y1="20" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#5c3a1a" stopOpacity="0" />
                    <stop offset="20%" stopColor="#5c3a1a" stopOpacity="0.5" />
                    <stop offset="35%" stopColor="#5c3a1a" stopOpacity="0" />
                    <stop offset="55%" stopColor="#5c3a1a" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#5c3a1a" stopOpacity="0" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}

export function Cat() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time } = useSpaceTime();
    const { enabled: motionEnabled } = useMotionPreference();
    const parallax = useParallax(14);

    if (!spaceOn || time !== "day" || !motionEnabled) return null;

    return (
        <motion.div aria-hidden="true" className="pointer-events-none fixed z-[6]" style={{ left: "44vw", bottom: "3vh", x: parallax.x, y: parallax.y }}>
            <motion.div
                animate={{ x: [0, 30, 55, 20, 0], scaleX: [1, 1, -1, -1, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.55, 0.8, 1] }}
            >
                <CatSvg />
            </motion.div>
        </motion.div>
    );
}
