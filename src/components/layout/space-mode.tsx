"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "next-themes";

const STORAGE_KEY = "suryash-space-mode";

interface SpaceModeValue {
    enabled: boolean;
    toggle: () => void;
}

const SpaceModeContext = createContext<SpaceModeValue>({ enabled: false, toggle: () => {} });

export function SpaceModeProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(false);
    const { theme, setTheme } = useTheme();
    const priorThemeRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "on") setEnabled(true);
        } catch {
            // ignore: default to off
        }
    }, []);

    // Lets the starfield show through the page's own gaps/margins instead of
    // rewriting every surface's background — only <body> itself goes
    // transparent, every card/section keeps its normal opaque bg-* token.
    //
    // The light theme's text colors are near-black (meant for a light page),
    // which is unreadable over a near-black starfield — so space mode also
    // forces dark mode while active, and restores whatever the visitor had
    // on exit, rather than silently leaving them in dark mode.
    useEffect(() => {
        document.body.style.background = enabled ? "transparent" : "";

        if (enabled) {
            priorThemeRef.current = theme;
            setTheme("dark");
        } else if (priorThemeRef.current !== undefined) {
            setTheme(priorThemeRef.current);
            priorThemeRef.current = undefined;
        }

        return () => {
            document.body.style.background = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
