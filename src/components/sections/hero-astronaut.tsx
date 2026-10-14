"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { m as motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SOCIAL } from "@/config/links";
import { useSound } from "@/components/layout/sound";
import { answer, SUGGESTIONS } from "@/content/assistant";
import { VisorCanvas, type VisorSignal } from "@/components/sections/visor-canvas";

const INTRO = [
    { src: "/audio/intro-1.m4a", text: "Oh, hi! I'm Suryash's AI assistant." },
    { src: "/audio/intro-2.m4a", text: "Basically, I run this place." },
    { src: "/audio/intro-3.m4a", text: "I knew you'd come back. I have that effect on people. So, what's the ask?" },
] as const;

const OPTIONS = [
    { label: "Full-time", src: "/audio/reply-fulltime.m4a", reply: "Full time. Good choice. Opening the contact desk, so you can reach Suryash directly.", href: "#contact" },
    { label: "Project work", src: "/audio/reply-project.m4a", reply: "Project work. Even better. Let's get you to the contact desk.", href: "#contact" },
    { label: "Work experience", src: "/audio/reply-experience.m4a", reply: "Work experience. United Parcel Service, NoBroker Interiors, and Botmatic. Here we go.", href: "#experience" },
    { label: "Projects", src: "/audio/reply-projects.m4a", reply: "Projects. Six automations, built and running. Let me show you.", href: "#work" },
] as const;

const TYPE_MS = 42;
const ease = [0.16, 1, 0.3, 1] as const;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function playClip(src: string): Promise<void> {
    return new Promise((resolve) => {
        try {
            const a = new Audio(src);
            const done = () => resolve();
            a.onended = done;
            a.onerror = done;
            setTimeout(done, 15000); // never hang the sequence
            a.play().catch(done);
        } catch {
            resolve();
        }
    });
}

/** Types `text` out; if the text only grew (same prefix) it carries on from where it was. */
function Typewriter({ text, onDone, caret = true }: { text: string; onDone?: () => void; caret?: boolean }) {
    const [n, setN] = useState(0);
    const prev = useRef("");
    const cb = useRef(onDone);
    useEffect(() => {
        cb.current = onDone;
    });
    useEffect(() => {
        let start = text.startsWith(prev.current) ? prev.current.length : 0;
        prev.current = text;
        setN(start);
        if (start >= text.length) {
            cb.current?.();
            return;
        }
        const id = setInterval(() => {
            start++;
            setN(start);
            if (start >= text.length) {
                clearInterval(id);
                cb.current?.();
            }
        }, TYPE_MS);
        return () => clearInterval(id);
    }, [text]);
    return (
        <>
            {text.slice(0, n)}
            {caret && <span className="ml-1 inline-block h-[0.85em] w-[0.45em] translate-y-[0.08em] animate-pulse bg-text-primary" aria-hidden="true" />}
        </>
    );
}

type Msg = { role: "you" | "bot"; text: string };

export function HeroAstronaut() {
    const { enabled } = useSound();
    const [mounted, setMounted] = useState(false);
    const [started, setStarted] = useState(false);
    const [prev, setPrev] = useState("");
    const [cur, setCur] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [busy, setBusy] = useState(false);
    const [copied, setCopied] = useState(false);
    const [log, setLog] = useState<Msg[]>([]);
    const [draft, setDraft] = useState("");
    const logRef = useRef<HTMLDivElement>(null);
    const figRef = useRef<HTMLDivElement>(null);
    const typingDone = useRef<(() => void) | null>(null);
    const alive = useRef(true);
    const signal = useRef<VisorSignal>({ nx: 0, ny: 0, dist: 0 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        alive.current = true;
        return () => {
            alive.current = false;
        };
    }, []);

    // the page stays put until the visitor presses start
    useEffect(() => {
        document.documentElement.style.overflow = started ? "" : "hidden";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [started]);

    /** show `text` (typed) and play `src` together; resolves when both finish */
    const say = useCallback(
        (text: string, src?: string) =>
            new Promise<void>((resolve) => {
                let pending = 2;
                const one = () => {
                    pending -= 1;
                    if (pending === 0) resolve();
                };
                typingDone.current = one;
                setCur(text);
                if (src && enabled) playClip(src).then(one);
                else one();
            }),
        [enabled],
    );

    const begin = useCallback(async () => {
        setStarted(true);
        await sleep(1100); // let the start transition play out
        await say(INTRO[0].text, INTRO[0].src);
        if (!alive.current) return;
        await sleep(200);
        await say(`${INTRO[0].text} ${INTRO[1].text}`, INTRO[1].src);
        if (!alive.current) return;
        await sleep(350);
        setPrev(`${INTRO[0].text} ${INTRO[1].text}`);
        await say(INTRO[2].text, INTRO[2].src);
        if (!alive.current) return;
        setShowOptions(true);
    }, [say]);

    // head tracking: cursor (or a slow idle look-around) drives springs
    const tx = useMotionValue(0);
    const ty = useMotionValue(0);
    const sx = useSpring(tx, { stiffness: 85, damping: 15, mass: 0.7 });
    const sy = useSpring(ty, { stiffness: 85, damping: 15, mass: 0.7 });
    // the whole figure drifts a few pixels against the cursor, like it floats in depth
    const floatX = useTransform(sx, [-1, 1], [10, -10]);
    const floatY = useTransform(sy, [-1, 1], [6, -6]);

    useEffect(() => {
        if (!started) return;
        let lastMove = performance.now() - 5000;
        let lastPt: [number, number] | null = null;
        let raf = 0;
        const t0 = performance.now();
        // a soft light follows the cursor across the helmet and shoulders (CSS vars, no re-render)
        const setSpot = (clientX: number, clientY: number) => {
            const el = figRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const bx = clientX - r.left, by = clientY - r.top;
            el.style.setProperty("--bx", `${bx}px`);
            el.style.setProperty("--by", `${by}px`);
            el.style.setProperty("--hx", `${bx - r.width * 0.16467}px`);
            el.style.setProperty("--hy", `${by}px`);
        };
        const onMove = (e: PointerEvent) => {
            lastMove = performance.now();
            const el = figRef.current;
            if (!el) return;
            setSpot(e.clientX, e.clientY);
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height * 0.3;
            const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5)));
            const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.5)));
            tx.set(nx); ty.set(ny);
            signal.current.nx = nx; signal.current.ny = ny;
            if (lastPt) signal.current.dist += Math.hypot(e.clientX - lastPt[0], e.clientY - lastPt[1]);
            lastPt = [e.clientX, e.clientY];
        };
        const tick = (now: number) => {
            if (now - lastMove > 2500) {
                const t = (now - t0) / 1000;
                const nx = Math.sin(t * 0.5) * 0.7, ny = Math.sin(t * 0.37 + 1) * 0.3;
                tx.set(nx); ty.set(ny);
                signal.current.nx = nx; signal.current.ny = ny;
                const r = figRef.current?.getBoundingClientRect();
                if (r) setSpot(r.left + r.width * (0.5 + nx * 0.28), r.top + r.height * (0.32 + ny * 0.25));
            }
            raf = requestAnimationFrame(tick);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        raf = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(raf);
        };
    }, [started, tx, ty]);

    const go = useCallback((href: string) => {
        if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        else window.open(href, "_blank");
    }, []);

    const choose = async (o: (typeof OPTIONS)[number]) => {
        if (busy) return;
        setBusy(true);
        setPrev(cur);
        await say(o.reply, o.src);
        await sleep(250);
        go(o.href);
        setBusy(false);
    };

    const ask = async (q: string) => {
        const question = q.trim();
        if (!question || busy) return;
        setBusy(true);
        setDraft("");
        setLog((l) => [...l, { role: "you", text: question }]);
        await sleep(450);
        setLog((l) => [...l, { role: "bot", text: answer(question) }]);
        setBusy(false);
    };

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, [log]);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(SOCIAL.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            window.location.href = `mailto:${SOCIAL.email}`;
        }
    };

    const gate = (
        <AnimatePresence>
            {!started && (
                <motion.div
                    key="gate"
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black px-6 text-center"
                    exit={{ opacity: 0, filter: "blur(18px)", scale: 1.06 }}
                    transition={{ duration: 1.1, ease }}
                >
                    <motion.p
                        className="font-display text-[clamp(22px,4.2vw,46px)] font-extralight uppercase leading-[1.25] tracking-[0.14em] text-white"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ letterSpacing: "0.5em", opacity: 0 }}
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
                        onClick={begin}
                        className="group relative mt-12 overflow-hidden rounded-full border border-white/40 px-9 py-3 font-display text-[12px] uppercase tracking-[0.35em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        <span className="relative transition-colors duration-500 group-hover:text-black">Click to start</span>
                    </motion.button>
                    <motion.span className="mt-4 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                        sound on · move your cursor
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {mounted && createPortal(gate, document.body)}

            <section className="relative left-1/2 min-h-[640px] w-screen -translate-x-1/2 overflow-hidden max-[899px]:h-[max(100svh,700px)] min-[900px]:h-[100svh]" aria-label="Intro">
                <h1 className="sr-only">Suryash Raj — digital marketing, operations, customer success</h1>

                {/* the figure */}
                <motion.div
                    className="absolute z-[2] w-[min(104vw,540px)] max-[899px]:left-1/2 max-[899px]:top-[7%] max-[899px]:-translate-x-1/2 min-[900px]:bottom-0 min-[900px]:right-[-3vw] min-[900px]:w-[min(58vw,118svh)]"
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(16px)" }}
                    animate={started ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 1.6, ease }}
                >
                    <motion.div ref={figRef} className="relative aspect-[668/613] w-full" style={{ x: floatX, y: floatY }}>
                        <div
                            className="pointer-events-none absolute -inset-[12%]"
                            style={{ background: "radial-gradient(ellipse 48% 44% at 50% 38%, oklch(0.76 0.12 185 / 0.22), transparent 70%), radial-gradient(ellipse 40% 36% at 62% 52%, oklch(0.6 0.2 300 / 0.16), transparent 70%)" }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/helmet/body.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full select-none" />
                        <div className="spot" style={{ maskImage: "url(/helmet/body.webp)", WebkitMaskImage: "url(/helmet/body.webp)", backgroundImage: "radial-gradient(circle 230px at var(--bx, -999px) var(--by, -999px), rgba(150,255,240,0.95), transparent 72%)" }} />

                        <div className="absolute" style={{ left: "16.467%", top: "0%", width: "67.365%", height: "67.21%" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/helmet/head.webp" alt="Astronaut helmet" draggable={false} className="absolute inset-0 h-full w-full select-none" />
                            <div className="absolute inset-0 opacity-90" style={{ clipPath: "ellipse(35.56% 34.47% at 48.44% 50.24%)" }}>
                                <VisorCanvas signal={signal} active={started} />
                            </div>
                            <div className="spot" style={{ maskImage: "url(/helmet/head.webp)", WebkitMaskImage: "url(/helmet/head.webp)", backgroundImage: "radial-gradient(circle 230px at var(--hx, -999px) var(--hy, -999px), rgba(150,255,240,0.95), transparent 72%)" }} />
                        </div>
                    </motion.div>
                </motion.div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-bg-primary to-transparent" />

                {/* the assistant */}
                <motion.div
                    className="glass absolute z-10 flex max-h-[58svh] flex-col min-[900px]:max-h-[80svh] overflow-hidden rounded-2xl p-5 max-[899px]:inset-x-4 max-[899px]:bottom-4 min-[900px]:left-[4.5vw] min-[900px]:top-1/2 min-[900px]:w-[min(36rem,42vw)] min-[900px]:-translate-y-1/2 min-[900px]:p-7"
                    initial={{ opacity: 0, y: 24 }}
                    animate={started ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.1, delay: 0.5, ease }}
                >
                    <p className="flex items-center gap-2 font-display text-[11px] font-normal uppercase tracking-[0.3em] text-accent-primary">
                        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-primary opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-accent-primary" /></span>
                        AI assistant · Suryash
                    </p>

                    <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none]" ref={logRef}>
                        {prev && (
                            <p className="font-display text-[clamp(15px,1.45vw,20px)] font-light leading-snug text-text-primary/45 blur-[3px] transition-all duration-700" aria-hidden="true">
                                {prev}
                            </p>
                        )}
                        <p className="mt-3 font-display text-[clamp(19px,2.2vw,31px)] font-extralight leading-[1.25] tracking-[0.005em] text-text-primary" aria-live="polite">
                            {started && cur ? <Typewriter text={cur} onDone={() => typingDone.current?.()} /> : null}
                        </p>

                        {log.length > 0 && (
                            <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-4">
                                {log.map((m, i) => (
                                    <div key={i} className={m.role === "you" ? "self-end rounded-2xl rounded-br-sm bg-accent-primary/90 px-3.5 py-2 font-space text-[14px] text-bg-primary" : "self-start rounded-2xl rounded-bl-sm border border-white/12 bg-white/5 px-3.5 py-2 font-space text-[14px] leading-relaxed text-text-primary"}>
                                        {m.role === "bot" && i === log.length - 1 ? <Typewriter text={m.text} caret={false} /> : m.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {showOptions && (
                            <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                                <div className="flex flex-wrap gap-2">
                                    {OPTIONS.map((o, i) => (
                                        <motion.button
                                            key={o.label}
                                            type="button"
                                            disabled={busy}
                                            onClick={() => choose(o)}
                                            className="rounded-full border border-white/25 bg-white/90 px-4 py-2 font-display text-[13.5px] font-medium tracking-[0.01em] text-black transition-colors hover:bg-accent-primary disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.09, duration: 0.5, ease }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {o.label}
                                        </motion.button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={copyEmail}
                                    className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-display text-[13px] text-text-secondary transition-colors hover:border-white/40 hover:text-text-primary"
                                    aria-label="Copy email address"
                                >
                                    <span className="truncate">Write me: <span className="underline underline-offset-2">{SOCIAL.email}</span></span>
                                    <span className="font-jetbrains text-[10px] uppercase tracking-widest text-accent-primary">{copied ? "copied" : "copy"}</span>
                                </button>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        void ask(draft);
                                    }}
                                    className="mt-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 p-1 pl-4 focus-within:border-accent-primary"
                                >
                                    <input
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        placeholder="Ask me anything about Suryash…"
                                        aria-label="Ask the assistant"
                                        className="min-w-0 flex-1 bg-transparent font-space text-[14px] text-text-primary outline-none placeholder:text-text-muted"
                                    />
                                    <button type="submit" disabled={busy || !draft.trim()} className="rounded-full bg-accent-primary px-4 py-1.5 font-display text-[12px] font-medium uppercase tracking-widest text-bg-primary transition-opacity disabled:opacity-40">
                                        Send
                                    </button>
                                </form>
                                {log.length === 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5 max-[899px]:hidden">
                                        {SUGGESTIONS.map((s) => (
                                            <button key={s} type="button" onClick={() => void ask(s)} className="rounded-full border border-white/12 px-3 py-1 font-space text-[12px] text-text-muted transition-colors hover:border-white/30 hover:text-text-primary">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </section>
        </>
    );
}
