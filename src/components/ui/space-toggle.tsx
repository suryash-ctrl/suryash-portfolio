"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon } from "@hugeicons/core-free-icons";
import { useSpaceMode } from "@/components/layout/space-mode";
import { cn } from "@/lib/utils";

export function SpaceToggle() {
    const { enabled, toggle } = useSpaceMode();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Turn off space mode" : "Turn on space mode"}
            title={enabled ? "Turn off space mode" : "Turn on space mode"}
            className={cn(
                "fixed bottom-4 left-4 z-[9999] flex size-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95",
                enabled ? "text-accent-primary" : "text-text-secondary",
            )}
            style={{
                background: "color-mix(in oklab, var(--bg-surface) 88%, transparent)",
                border: "1px solid var(--border-default)",
            }}
        >
            <HugeiconsIcon icon={Rocket01Icon} size={16} />
        </button>
    );
}
