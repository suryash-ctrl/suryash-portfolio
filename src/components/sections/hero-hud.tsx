"use client";

import { useState, useEffect } from "react";
import { useMotionPreference } from "@/components/layout/motion-preference";

function Clock() {
    const [time, setTime] = useState<{ ist: string; utc: string } | null>(null);

    useEffect(() => {
        function update() {
            const now = new Date();
            const istFull = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
            const utcFull = now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: true });
            setTime({ ist: istFull, utc: utcFull });
        }
        update();
        const interval = setInterval(update, 60_000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    const istParts = time.ist.split(" ");
    const utcParts = time.utc.split(" ");

    return (
        <span className="font-jetbrains text-[11px] tabular-nums uppercase text-text-tertiary">
            <span className="text-text-muted">IST </span>
            <span className="text-text-secondary">{istParts[0]}</span>
            <span className="text-text-muted"> {istParts[1]}</span>
            <span className="hidden min-[400px]:inline">
                <span className="text-text-muted"> · UTC </span>
                <span className="text-text-secondary">{utcParts[0]}</span>
                <span className="text-text-muted"> {utcParts[1]}</span>
            </span>
        </span>
    );
}

function MuteVisualToggle() {
    const { manuallyEnabled, toggle } = useMotionPreference();
    return (
        <button
            type="button"
            onClick={toggle}
            className="font-jetbrains text-[11px] uppercase tracking-wide text-text-muted transition-colors duration-200 hover:text-text-secondary focus-visible:text-accent-primary"
            aria-pressed={!manuallyEnabled}
        >
            {manuallyEnabled ? "MUTE VISUAL" : "UNMUTE VISUAL"}
        </button>
    );
}

export function HeroHud() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-y border-border-subtle py-2.5">
            <span className="flex items-center gap-2 font-space text-[12px] text-accent-tertiary">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-tertiary animate-[status-pulse_2s_ease-in-out_infinite]" />
                OPEN TO WORK
            </span>
            <span className="font-jetbrains text-[11px] uppercase tracking-wide text-text-muted">PUNE, INDIA · 18.47° N</span>
            <Clock />
            <MuteVisualToggle />
        </div>
    );
}
