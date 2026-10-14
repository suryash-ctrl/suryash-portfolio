"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, VolumeMute02Icon } from "@hugeicons/core-free-icons";
import { useSound } from "@/components/layout/sound";
import { cn } from "@/lib/utils";

export function SoundToggle() {
    const { enabled, toggle } = useSound();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
            title={enabled ? "Mute ambient sound" : "Play ambient sound"}
            className={cn(
                "fixed bottom-4 left-4 z-[9999] flex size-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95",
                enabled ? "text-accent-primary" : "text-text-secondary",
            )}
            style={{
                background: "color-mix(in oklab, var(--bg-surface) 88%, transparent)",
                border: "1px solid var(--border-default)",
            }}
        >
            <HugeiconsIcon icon={enabled ? VolumeHighIcon : VolumeMute02Icon} size={16} />
        </button>
    );
}
