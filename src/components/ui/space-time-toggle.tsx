"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";
import { cn } from "@/lib/utils";

/** Only shown once space mode is on — switches the scene between the
 *  night sky (starfield, planets, black hole) and the day meadow (sun,
 *  clouds, astronaut resting in the grass). */
export function SpaceTimeToggle() {
    const { enabled: spaceOn } = useSpaceMode();
    const { time, toggle } = useSpaceTime();

    if (!spaceOn) return null;

    const isDay = time === "day";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={isDay}
            aria-label={isDay ? "Switch to night scene" : "Switch to day scene"}
            title={isDay ? "Switch to night scene" : "Switch to day scene"}
            className={cn(
                "fixed bottom-4 left-16 z-[9999] flex size-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95",
                isDay ? "text-[#f2a73e]" : "text-text-secondary",
            )}
            style={{
                background: "color-mix(in oklab, var(--bg-surface) 88%, transparent)",
                border: "1px solid var(--border-default)",
            }}
        >
            <HugeiconsIcon icon={isDay ? Sun03Icon : Moon02Icon} size={16} />
        </button>
    );
}
