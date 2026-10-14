"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*!?<>{}[]";

interface ScrambleButtonProps {
    text: string;
    href: string;
    download?: string;
    external?: boolean;
    className?: string;
}

export function ScrambleButton({ text, href, download, external, className }: ScrambleButtonProps) {
    const [hovered, setHovered] = useState(false);
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const scramble = useCallback(() => {
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, i) => {
                        if (char === " ") return " ";
                        if (i < iteration) return text[i];
                        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                    })
                    .join(""),
            );
            iteration += 1 / 2;
            if (iteration > text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplayText(text);
            }
        }, 30);
    }, [text]);

    const unscramble = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
    }, [text]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <a
            href={href}
            download={download}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={cn(
                "group relative flex w-full items-center justify-center overflow-hidden border border-accent-primary px-3 py-1.5 font-jetbrains text-[12px] uppercase tracking-wider",
                className,
            )}
            onPointerEnter={(e) => {
                if (e.pointerType === "mouse") {
                    setHovered(true);
                    scramble();
                }
            }}
            onPointerLeave={(e) => {
                if (e.pointerType === "mouse") {
                    setHovered(false);
                    unscramble();
                }
            }}
            onClick={() => {
                setHovered(true);
                scramble();
            }}
        >
            <span
                className="absolute inset-0 bg-accent-primary motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
                style={{
                    transformOrigin: hovered ? "right" : "left",
                    transform: hovered ? "scaleX(0)" : "scaleX(1)",
                }}
            />
            <span
                className={cn(
                    "relative motion-safe:transition-colors motion-safe:duration-500",
                    hovered ? "text-accent-primary" : "text-bg-primary",
                )}
            >
                {displayText}
            </span>
        </a>
    );
}
