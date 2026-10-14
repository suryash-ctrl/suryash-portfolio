"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeKeys() {
    const { setTheme } = useTheme();

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement).tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            switch (e.key.toLowerCase()) {
                case "d":
                    setTheme("dark");
                    break;
                case "l":
                    setTheme("light");
                    break;
                case "s":
                    setTheme("system");
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setTheme]);

    return null;
}
