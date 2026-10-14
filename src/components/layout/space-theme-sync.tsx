"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useSpaceMode } from "@/components/layout/space-mode";
import { useSpaceTime } from "@/components/layout/space-time";

/** Renderless — just keeps the light/dark theme in sync with the space
 *  scene. Night (starfield) needs dark mode's light text; day (bright sky
 *  meadow) needs light mode's dark text — forcing dark unconditionally, the
 *  first version of this, made day-mode text invisible against its own sky.
 *  Restores whatever the visitor had before on exit, not just "dark". */
export function SpaceThemeSync() {
    const { enabled } = useSpaceMode();
    const { time } = useSpaceTime();
    const { theme, setTheme } = useTheme();
    const priorThemeRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (enabled) {
            if (priorThemeRef.current === undefined) priorThemeRef.current = theme;
            setTheme(time === "night" ? "dark" : "light");
        } else if (priorThemeRef.current !== undefined) {
            setTheme(priorThemeRef.current);
            priorThemeRef.current = undefined;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, time]);

    return null;
}
