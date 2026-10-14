"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz@#$%&*!?";

const SLOTS = {
    rotating_1: {
        words: ["rate discrepancies", "SLA breaches", "billing errors", "lead follow-up", "escalation queues"],
        interval: 5000,
        offset: 0,
    },
    rotating_2: {
        words: ["revenue leakage", "campaign waste", "missed deadlines", "data drift", "manual reporting"],
        interval: 5000,
        offset: 0,
    },
    rotating_3: {
        words: ["reconciling", "automating", "negotiating", "following up", "reporting"],
        interval: 5000,
        offset: 0,
    },
} as const;

function useScrambleSlot(words: readonly string[], interval: number, offset: number, visible: boolean) {
    const indexRef = useRef(0);
    const [display, setDisplay] = useState(words[0]);
    const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrambleTo = useCallback((target: string) => {
        let iteration = 0;
        if (scrambleRef.current) clearInterval(scrambleRef.current);

        scrambleRef.current = setInterval(() => {
            setDisplay(
                target
                    .split("")
                    .map((char, i) => {
                        if (char === " ") return " ";
                        if (i < iteration) return target[i];
                        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                    })
                    .join(""),
            );

            iteration += 0.4;

            if (iteration > target.length) {
                if (scrambleRef.current) clearInterval(scrambleRef.current);
                setDisplay(target);
            }
        }, 35);
    }, []);

    useEffect(() => {
        if (!visible) {
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
            if (scrambleRef.current) { clearInterval(scrambleRef.current); scrambleRef.current = null; }
            setDisplay(words[indexRef.current]);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            tickRef.current = setInterval(() => {
                indexRef.current = (indexRef.current + 1) % words.length;
                scrambleTo(words[indexRef.current]);
            }, interval);
        }, offset);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (tickRef.current) clearInterval(tickRef.current);
            if (scrambleRef.current) clearInterval(scrambleRef.current);
        };
    }, [words, interval, offset, scrambleTo, visible]);

    return display;
}

export function HeroManifesto() {
    const ref = useRef<HTMLParagraphElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const slot1 = useScrambleSlot(SLOTS.rotating_1.words, SLOTS.rotating_1.interval, SLOTS.rotating_1.offset, visible);
    const slot2 = useScrambleSlot(SLOTS.rotating_2.words, SLOTS.rotating_2.interval, SLOTS.rotating_2.offset, visible);
    const slot3 = useScrambleSlot(SLOTS.rotating_3.words, SLOTS.rotating_3.interval, SLOTS.rotating_3.offset, visible);

    return (
        <p ref={ref} className="font-space text-[16px] leading-normal text-text-secondary">
            I care about the things most people skip. The <span className="text-accent-primary">{slot1}</span>, the <span className="text-accent-primary">{slot2}</span>, the place where a deal
            closes and the follow-through quietly starts to slip. Most days I&apos;m <span className="text-accent-primary">{slot3}</span> somewhere in that gap.
        </p>
    );
}
