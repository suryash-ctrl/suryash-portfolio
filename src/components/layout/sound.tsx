"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "suryash-sound";

interface SoundValue {
    enabled: boolean;
    toggle: () => void;
}

const SoundContext = createContext<SoundValue>({ enabled: true, toggle: () => {} });

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(true);

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

    return <SoundContext.Provider value={{ enabled, toggle }}>{children}</SoundContext.Provider>;
}

export function useSound() {
    return useContext(SoundContext);
}
