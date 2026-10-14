"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "suryash-motion-enabled";

interface MotionPreferenceValue {
    enabled: boolean;
    toggle: () => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceValue>({
    enabled: true,
    toggle: () => {},
});

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved === "off") setEnabled(false);
        } catch {
            // ignore: default to enabled
        }
    }, []);

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

    return <MotionPreferenceContext.Provider value={{ enabled, toggle }}>{children}</MotionPreferenceContext.Provider>;
}

/** True only when the visitor allows decorative motion: manual toggle on,
 *  and the OS has not requested reduced motion. Decorative/ambient effects
 *  (cursor trail, generative banner) should gate on this; purposeful UI
 *  motion (hover states, section reveals) should not. */
export function useMotionPreference() {
    const { enabled, toggle } = useContext(MotionPreferenceContext);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReducedMotion(mql.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return { enabled: enabled && !reducedMotion, manuallyEnabled: enabled, toggle };
}
