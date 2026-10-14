"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { m as motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SOCIAL } from "@/config/links";
import { useSound } from "@/components/layout/sound";

const GREETING = "Hello, this is Suryash. I knew you'd come back. I have that effect on people. So, what's the ask?";

const OPTIONS = [
    { label: "Hire me", reply: "Smart move. Taking you to the contact desk.", href: "#contact" },
    { label: "See the work", reply: "Six automations, built and running. Opening the work.", href: "#work" },
    { label: "Walk me through experience", reply: "UPS, NoBroker, Botmatic. In that order. Here we go.", href: "#experience" },
    { label: "What can you do?", reply: "Marketing, operations and customer success. Let me show you.", href: "#capabilities" },
    { label: "Get the CV", reply: "One page. No fluff. Downloading.", href: "/Suryash-Raj-Resume.pdf" },
] as const;

// what flickers on the visor, in rotation
const VISOR = ["😀", "{ }", "🚀", "01101", "😎", "</>", "👾", "ROAS 4.2x", "🤖", "$ ./ship", "✨", "SLA OK", "🧠", "404", "📈", "const you = new Hire()"];

function pickVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
    const male = /daniel|alex|fred|david|mark|guy|james|google uk english male|male|arthur|aaron|gordon/i;
    return voices.find((v) => male.test(v.name)) ?? voices.find((v) => v.lang === "en-GB") ?? voices[0] ?? null;
}

function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const v = pickVoice();
        if (v) u.voice = v;
        u.lang = v?.lang ?? "en-US";
        u.pitch = 0.78; // lower, male register even on neutral voices
        u.rate = 0.94;
        u.volume = 1;
        window.speechSynthesis.speak(u);
    } catch {
        // speech is a bonus; the text still shows
    }
}

function Typewriter({ text, speedMs = 38 }: { text: string; speedMs?: number }) {
    const [n, setN] = useState(0);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setN(0);
        const id = setInterval(() => setN((c) => (c >= text.length ? (clearInterval(id), c) : c + 1)), speedMs);
        return () => clearInterval(id);
    }, [text, speedMs]);
    return (
        <>
            {text.slice(0, n)}
            <span className="ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] animate-pulse bg-text-primary" aria-hidden="true" />
        </>
    );
}

function VisorGlitch() {
    const [i, setI] = useState(0);
    const [burst, setBurst] = useState(false);
    useEffect(() => {
        const id = setInterval(() => {
            setBurst(true);
            setTimeout(() => {
                setI((c) => (c + 1 + Math.floor(Math.random() * 3)) % VISOR.length);
                setBurst(false);
            }, 140);
        }, 1700);
        return () => clearInterval(id);
    }, []);
    const item = VISOR[i];
    const code = /[{}<>$/]|\d/.test(item) && item.length > 2;
    const long = item.length > 6;
    return (
        <div className="pointer-events-none absolute inset-[6%] flex items-center justify-center overflow-hidden rounded-[45%]" aria-hidden="true">
            <span
                className={`select-none font-jetbrains leading-none whitespace-nowrap ${long ? "text-[min(0.8vw,8px)]" : code ? "text-[min(1.3vw,12px)] tracking-tight" : "text-[min(3.2vw,34px)]"} ${burst ? "visor-burst" : "visor-idle"}`}
                style={{ color: "oklch(0.88 0.12 185)", textShadow: "-1.5px 0 #ff2d6f, 1.5px 0 #25f4ee, 0 0 12px oklch(0.8 0.14 185 / 0.8)" }}
            >
                {item}
            </span>
            <span className="visor-scan absolute inset-0" />
        </div>
    );
}

export function HeroAstronaut() {
    const { enabled } = useSound();
    const [started, setStarted] = useState(false);
    const [line, setLine] = useState(GREETING);
    const [showOptions, setShowOptions] = useState(false);
    const sceneRef = useRef<HTMLDivElement>(null);

    // lock page scroll until the visitor enters
    useEffect(() => {
        document.documentElement.style.overflow = started ? "" : "hidden";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [started]);

    // preload voices
    useEffect(() => {
        if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    }, []);

    const start = useCallback(() => {
        setStarted(true);
        if (enabled) speak(GREETING);
        // options appear as the greeting finishes typing
        setTimeout(() => setShowOptions(true), GREETING.length * 38 + 400);
    }, [enabled]);

    // head tracking: pointer (or a slow idle look-around) → springs
    const tx = useMotionValue(0);
    const ty = useMotionValue(0);
    const sx = useSpring(tx, { stiffness: 90, damping: 16, mass: 0.6 });
    const sy = useSpring(ty, { stiffness: 90, damping: 16, mass: 0.6 });
    const rotY = useTransform(sx, [-1, 1], [-30, 30]);
    const rotX = useTransform(sy, [-1, 1], [14, -14]);
    const moveX = useTransform(sx, [-1, 1], ["-5%", "5%"]);
    const visorX = useTransform(sx, [-1, 1], ["-14%", "14%"]);
    const visorY = useTransform(sy, [-1, 1], ["-10%", "10%"]);

    useEffect(() => {
        let last = performance.now();
        let raf = 0;
        const start = last;
        const onMove = (e: PointerEvent) => {
            last = performance.now();
            const el = sceneRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            // normalise against the helmet itself so the gaze tracks the pointer
            const hx = r.left + r.width * 0.5 + 0;
            const hy = r.top + r.height * 0.32;
            tx.set(Math.max(-1, Math.min(1, (e.clientX - hx) / (window.innerWidth * 0.45))));
            ty.set(Math.max(-1, Math.min(1, (e.clientY - hy) / (window.innerHeight * 0.45))));
        };
        const tick = (now: number) => {
            if (now - last > 2500) {
                const t = (now - start) / 1000;
                tx.set(Math.sin(t * 0.5) * 0.7);
                ty.set(Math.sin(t * 0.37 + 1) * 0.3);
            }
            raf = requestAnimationFrame(tick);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        raf = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(raf);
        };
    }, [tx, ty]);

    const choose = (opt: (typeof OPTIONS)[number]) => {
        setLine(opt.reply);
        if (enabled) speak(opt.reply);
        setTimeout(() => {
            if (opt.href.startsWith("#")) document.querySelector(opt.href)?.scrollIntoView({ behavior: "smooth" });
            else window.open(opt.href, "_blank");
        }, 1400);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const gate = (
            <AnimatePresence>
                {!started && (
                    <motion.div
                        key="gate"
                        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black px-6 text-center"
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.p
                            className="font-display text-[clamp(22px,4.2vw,46px)] font-extralight uppercase leading-[1.25] tracking-[0.14em] text-white"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.4, delay: 0.3 }}
                        >
                            You have arrived.
                            <br />
                            The prophecy is complete.
                            <br />
                            <span className="text-white/60">How can I serve?</span>
                        </motion.p>
                        <motion.button
                            type="button"
                            onClick={start}
                            className="mt-12 rounded-full border border-white/40 px-8 py-3 font-display text-[12px] uppercase tracking-[0.35em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.6 }}
                        >
                            Click to start
                        </motion.button>
                        <motion.span
                            className="mt-4 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.2 }}
                        >
                            🔊 sound on
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
    );

    return (
        <>
            {mounted && createPortal(gate, document.body)}

            <section className="relative left-1/2 h-[100svh] min-h-[640px] w-screen -translate-x-1/2 overflow-hidden" aria-label="Intro">
                <h1 className="sr-only">Suryash Raj — digital marketing, operations, customer success</h1>

                {/* scene: cover-fitted photo, astronaut sits right of centre on wide screens */}
                <div
                    ref={sceneRef}
                    className="absolute top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2 min-[900px]:left-[64%] min-[900px]:top-1/2"
                    style={{
                        width: "max(100vw, calc(100svh * 1.2414))",
                        aspectRatio: "1080 / 870",
                        maskImage: "radial-gradient(ellipse 62% 66% at 51% 46%, #000 55%, transparent 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse 62% 66% at 51% 46%, #000 55%, transparent 100%)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/astro/scene.jpg" alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />

                    {/* head: perspective tilt toward the cursor, pivoting at the collar */}
                    <div className="absolute" style={{ left: "45.926%", top: "27.586%", width: "10.74%", height: "11.494%", perspective: 520 }}>
                        <motion.div
                            className="relative h-full w-full"
                            style={{ rotateY: rotY, rotateX: rotX, x: moveX, transformOrigin: "50% 90%", transformStyle: "preserve-3d" }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/astro/helmet.png" alt="Astronaut" className="absolute inset-0 h-full w-full select-none" draggable={false} />
                            <motion.div
                                className="absolute"
                                style={{ left: "18.1%", top: "22%", width: "63.8%", height: "68%", x: visorX, y: visorY }}
                            >
                                <VisorGlitch />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* dark wash so text always reads */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-bg-primary/20 to-transparent max-[899px]:bg-gradient-to-t max-[899px]:from-bg-primary/95 max-[899px]:via-bg-primary/30 max-[899px]:to-transparent" />

                {/* assistant */}
                <div className="absolute inset-x-6 bottom-[9%] z-10 max-w-[34rem] min-[900px]:inset-x-auto min-[900px]:bottom-auto min-[900px]:left-[7%] min-[900px]:top-1/2 min-[900px]:-translate-y-1/2">
                    <p className="font-display text-[11px] font-light uppercase tracking-[0.3em] text-accent-primary">◉ Assistant · Suryash</p>
                    <p className="mt-4 min-h-[7.5rem] font-display text-[clamp(20px,2.6vw,32px)] font-extralight leading-[1.3] tracking-[0.01em] text-text-primary" aria-live="polite">
                        {started ? <Typewriter text={line} /> : null}
                    </p>
                    <div className="mt-6 flex min-h-[7rem] flex-wrap gap-2">
                        <AnimatePresence>
                            {showOptions &&
                                OPTIONS.map((o, i) => (
                                    <motion.button
                                        key={o.label}
                                        type="button"
                                        onClick={() => choose(o)}
                                        className="rounded-full border border-border-strong bg-bg-surface/70 px-4 py-2 font-display text-[13px] font-normal tracking-[0.03em] text-text-primary backdrop-blur-md transition-colors hover:border-accent-primary hover:bg-accent-primary hover:text-bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                    >
                                        {o.label}
                                    </motion.button>
                                ))}
                        </AnimatePresence>
                    </div>
                    {showOptions && (
                        <p className="mt-3 font-jetbrains text-[11px] tracking-[0.08em] text-text-muted">
                            or write: <a href={`mailto:${SOCIAL.email}`} className="text-text-secondary underline decoration-border-strong underline-offset-4 hover:text-accent-primary">{SOCIAL.email}</a>
                        </p>
                    )}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-[3%] z-10 flex justify-center font-jetbrains text-[9px] uppercase tracking-[0.3em] text-text-muted max-[899px]:hidden">
                    Scroll
                </div>
            </section>
        </>
    );
}
