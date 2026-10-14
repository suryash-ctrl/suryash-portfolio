"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "suryash-space-mode";

interface SpaceModeValue {
    enabled: boolean;
    toggle: () => void;
}

const SpaceModeContext = createContext<SpaceModeValue>({ enabled: true, toggle: () => {} });

export function SpaceModeProvider({ children }: { children: React.ReactNode }) {
    // On by default — the immersive space theme is the first-load experience.
    // A visitor who explicitly turns it off (toggle persists "off") gets the
    // plain professional view back on their next visit.
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved === "off") setEnabled(false);
        } catch {
            // ignore: default to on
        }
    }, []);

    // Lets the scene (starfield or day sky) show through the page's own
    // gaps/margins instead of rewriting every surface's background — only
    // <body> itself goes transparent, every card/section keeps its normal
    // opaque bg-* token. Which light/dark theme to force for legibility is
    // handled separately in SpaceThemeSync, since it depends on day vs night.
    useEffect(() => {
        document.body.style.background = enabled ? "transparent" : "";
        return () => {
            document.body.style.background = "";
        };
    }, [enabled]);

    const toggle = useCallback(() => {
        setEnabled((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
            } catch {
                // ignore: preference just won't persist
            }
            return next;
        });
    }, []);

    return <SpaceModeContext.Provider value={{ enabled, toggle }}>{children}</SpaceModeContext.Provider>;
}

export function useSpaceMode() {
    return useContext(SpaceModeContext);
}
