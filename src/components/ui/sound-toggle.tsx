"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, VolumeMute02Icon } from "@hugeicons/core-free-icons";
import { useSound } from "@/components/layout/sound";
import { cn } from "@/lib/utils";

export function SoundToggle() {
    const { enabled, unlocked, toggle } = useSound();
    // On but not yet allowed to play: the browser is waiting for a gesture.
    // A click here *is* that gesture (the audio component's window listener
    // unlocks on it), so it must not also mute.
    const waiting = enabled && !unlocked;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2">
            <button
                type="button"
                onClick={() => {
                    if (!waiting) toggle();
                }}
                aria-pressed={enabled}
                aria-label={waiting ? "Tap to start ambient sound" : enabled ? "Mute ambient sound" : "Play ambient sound"}
                title={waiting ? "Tap to start ambient sound" : enabled ? "Mute ambient sound" : "Play ambient sound"}
                className={cn(
                    "relative flex size-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95",
                    enabled ? "text-accent-primary" : "text-text-secondary",
                )}
                style={{
                    background: "color-mix(in oklab, var(--bg-surface) 88%, transparent)",
                    border: "1px solid var(--border-default)",
                }}
            >
                {waiting && <span className="absolute inset-0 animate-ping rounded-full border border-accent-primary/60" aria-hidden="true" />}
                <HugeiconsIcon icon={enabled ? VolumeHighIcon : VolumeMute02Icon} size={16} />
            </button>
            {waiting && (
                <span className="pointer-events-none rounded-full border border-border-default bg-bg-surface/90 px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.18em] text-text-secondary backdrop-blur-md">
                    Tap for sound
                </span>
            )}
        </div>
    );
}
