"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "suryash-space-time";
export type SpaceTime = "night" | "day";

interface SpaceTimeValue {
    time: SpaceTime;
    toggle: () => void;
}

const SpaceTimeContext = createContext<SpaceTimeValue>({ time: "night", toggle: () => {} });

export function SpaceTimeProvider({ children }: { children: React.ReactNode }) {
    const [time, setTime] = useState<SpaceTime>("night");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved === "day" || saved === "night") setTime(saved);
        } catch {
            // ignore: default to night
        }
    }, []);

    const toggle = useCallback(() => {
        setTime((prev) => {
            const next = prev === "night" ? "day" : "night";
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // ignore: preference just won't persist
            }
            return next;
        });
    }, []);

    return <SpaceTimeContext.Provider value={{ time, toggle }}>{children}</SpaceTimeContext.Provider>;
}

export function useSpaceTime() {
    return useContext(SpaceTimeContext);
}
