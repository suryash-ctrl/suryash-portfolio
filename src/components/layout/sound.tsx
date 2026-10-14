"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "suryash-sound";

interface SoundValue {
    /** visitor wants sound */
    enabled: boolean;
    /** the browser has actually let the audio start (needs a click/tap/key) */
    unlocked: boolean;
    setUnlocked: (v: boolean) => void;
    toggle: () => void;
}

const SoundContext = createContext<SoundValue>({ enabled: true, unlocked: false, setUnlocked: () => {}, toggle: () => {} });

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(true);
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (localStorage.getItem(STORAGE_KEY) === "off") setEnabled(false);
        } catch {
            // ignore: default to on
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

    return <SoundContext.Provider value={{ enabled, unlocked, setUnlocked, toggle }}>{children}</SoundContext.Provider>;
}

export function useSound() {
    return useContext(SoundContext);
}
