"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const WORD = "SURYASH";
const GLYPHS = "▓▒░#@%&*+=<>/\\|01{}[]";
const FPS = 12; // every glitch step is a discrete frame, like film

/** The name assembles from noise one frame at a time (12 fps, letters lock
 *  left to right), then keeps glitching in stepped CSS frames: RGB-split
 *  ghost layers, sliced rows and jumps, with a heavier burst every few seconds. */
function GlitchWord() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.4 });
    const [text, setText] = useState(WORD);
    const [settled, setSettled] = useState(false);
    const played = useRef(false);

    useEffect(() => {
        if (!inView || played.current) return;
        played.current = true;
        let frame = 0;
        const total = 22;
        const id = setInterval(() => {
            frame++;
            const locked = Math.floor((frame / total) * WORD.length * 1.15);
            setText(
                WORD.split("")
                    .map((ch, i) => (i < locked ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
                    .join(""),
            );
            if (frame >= total) {
                clearInterval(id);
                setText(WORD);
                setSettled(true);
            }
        }, 1000 / FPS);
        return () => clearInterval(id);
    }, [inView]);

    return (
        <div ref={ref} className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <div className={`glitch-word relative select-none text-center font-display leading-[0.75] text-accent-primary ${settled ? "is-live" : ""}`} style={{ fontSize: "clamp(54px, 19.5vw, 400px)", letterSpacing: "-0.02em" }} aria-hidden="true" data-text={text}>
                {text}
            </div>
            <span className="sr-only">Suryash</span>
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 45%, var(--bg-primary) 100%)" }}
            />
        </div>
    );
}

export function Footer() {
    return (
        <footer className="relative mt-24 -mx-6 pb-0">
            <div className="mx-auto max-w-2xl px-6">
                <div className="flex items-center justify-between py-4">
                    <span className="font-space text-[10px] tracking-wider text-text-muted">&copy; Suryash Raj. All rights reserved.</span>
                    <span className="font-jetbrains text-[10px] uppercase tracking-[0.2em] text-text-muted">Pune, India</span>
                </div>
            </div>
            <GlitchWord />
        </footer>
    );
}
