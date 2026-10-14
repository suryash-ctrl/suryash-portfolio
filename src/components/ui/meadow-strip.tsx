"use client";

import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";

/** Deterministic scatter — same pattern every load, no client/server
 *  mismatch, no need for real randomness here. */
function seeded(i: number, salt: number) {
    const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

const FLOWER_COLORS = ["#e2572b", "#e2572b", "#f2b4c9", "#fdfdf4", "#8f6fc2", "#fdfdf4"];

/** An original meadow silhouette — grass blades and flower dots in the
 *  reference photo's palette (poppy orange, lavender, daisy white) — built
 *  from SVG shapes, not the photo itself. The astronaut (day mode) rests
 *  on top of it. */
export function MeadowStrip() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time } = useSpaceTime();

    if (!spaceOn || time !== "day") return null;

    const blades = Array.from({ length: 46 }, (_, i) => {
        const x = seeded(i, 1) * 400;
        const h = 14 + seeded(i, 2) * 22;
        const lean = (seeded(i, 3) - 0.5) * 10;
        return { x, h, lean };
    });
    const flowers = Array.from({ length: 16 }, (_, i) => {
        const x = seeded(i, 5) * 400;
        const y = seeded(i, 6) * 16;
        const r = 2 + seeded(i, 7) * 1.8;
        const color = FLOWER_COLORS[Math.floor(seeded(i, 8) * FLOWER_COLORS.length)];
        return { x, y, r, color };
    });

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[3]"
            style={{ height: "clamp(70px, 14vh, 150px)" }}
        >
            <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                    <linearGradient id="meadowGround" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3c5a2e" />
                        <stop offset="100%" stopColor="#16250f" />
                    </linearGradient>
                </defs>
                <path d="M0,22 Q40,10 90,20 T200,16 T310,22 T400,14 V100 H0 Z" fill="url(#meadowGround)" />
                {blades.map((b, i) => (
                    <line
                        key={i}
                        x1={b.x}
                        y1={30}
                        x2={b.x + b.lean}
                        y2={30 - b.h}
                        stroke="#4f7a3a"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                ))}
                {flowers.map((f, i) => (
                    <circle key={i} cx={f.x} cy={28 - f.y} r={f.r} fill={f.color} opacity="0.9" />
                ))}
            </svg>
        </div>
    );
}
