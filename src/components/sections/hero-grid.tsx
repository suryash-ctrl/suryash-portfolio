"use client";

import { m as motion } from "framer-motion";
import { SOCIAL } from "@/config/links";

const ease = [0.16, 1, 0.3, 1] as const;

/** Letters rise into place one by one from behind a clip line. */
function KineticLine({ text, delay, align = "left" }: { text: string; delay: number; align?: "left" | "right" }) {
    return (
        <span className={`flex overflow-hidden ${align === "right" ? "justify-end" : ""}`} aria-hidden="true">
            {text.split("").map((ch, i) => (
                <motion.span
                    key={i}
                    className="inline-block whitespace-pre"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, delay: delay + i * 0.028, ease }}
                >
                    {ch}
                </motion.span>
            ))}
        </span>
    );
}

function CornerLabel({ n, children, className, delay }: { n: string; children: React.ReactNode; className: string; delay: number }) {
    return (
        <motion.div
            className={`absolute font-display text-[11px] font-light uppercase tracking-[0.18em] text-text-secondary min-[560px]:text-[12px] ${className}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease }}
        >
            <span className="text-text-muted">{n}. </span>
            {children}
        </motion.div>
    );
}

/** Corner brackets drawn at the four cells around the centre, echoing the
 *  page grid and framing the particle sphere that sits behind this section. */
function Bracket({ className }: { className: string }) {
    return <span aria-hidden="true" className={`absolute h-[75px] w-[75px] border-border-strong ${className}`} />;
}

export function HeroGrid() {
    return (
        <section className="relative left-1/2 h-[100svh] min-h-[620px] w-screen -translate-x-1/2" aria-label="Intro">
            <h1 className="sr-only">Suryash Raj — digital marketing, operations, customer success</h1>

            <div className="absolute inset-x-6 top-[14%] bottom-[14%] min-[560px]:inset-x-[8%]">
                <CornerLabel n="01" className="top-0 left-0" delay={0.2}>
                    Digital marketing
                </CornerLabel>
                <CornerLabel n="02" className="top-0 right-0 text-right" delay={0.3}>
                    Pune based
                </CornerLabel>
                <CornerLabel n="03" className="bottom-0 left-0 normal-case tracking-[0.08em]" delay={0.4}>
                    <a href={`mailto:${SOCIAL.email}`} className="pointer-events-auto transition-colors hover:text-accent-primary">
                        {SOCIAL.email}
                    </a>
                </CornerLabel>
                <CornerLabel n="04" className="right-0 bottom-0 text-right" delay={0.5}>
                    <a href="#contact" className="pointer-events-auto text-text-primary transition-colors hover:text-accent-primary">
                        Open to work
                    </a>
                </CornerLabel>
            </div>

            {/* frames around the centre where the sphere sits */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[300px] w-[450px] -translate-x-1/2 -translate-y-1/2 min-[900px]:block">
                <Bracket className="top-0 left-0 border-t border-l" />
                <Bracket className="top-0 right-0 border-t border-r" />
                <Bracket className="bottom-0 left-0 border-b border-l" />
                <Bracket className="right-0 bottom-0 border-r border-b" />
            </div>

            {/* split tagline either side of the sphere (stacked above/below on narrow screens) */}
            <p className="sr-only">Operations that hold up. Details that move revenue.</p>
            <div className="absolute top-[21%] left-6 font-display text-[30px] leading-[1.15] font-extralight uppercase tracking-[0.06em] text-text-primary min-[560px]:text-[40px] min-[900px]:top-1/2 min-[900px]:left-[7%] min-[900px]:-translate-y-1/2 min-[1200px]:text-[44px]">
                <KineticLine text="Operations" delay={0.5} />
                <KineticLine text="that hold up" delay={0.75} />
            </div>
            <div className="absolute right-6 bottom-[21%] text-right font-display text-[30px] leading-[1.15] font-extralight uppercase tracking-[0.06em] text-text-primary min-[560px]:text-[40px] min-[900px]:top-1/2 min-[900px]:right-[7%] min-[900px]:bottom-auto min-[900px]:-translate-y-1/2 min-[1200px]:text-[44px]">
                <KineticLine text="Details that" delay={0.9} align="right" />
                <KineticLine text="move revenue" delay={1.15} align="right" />
            </div>

            <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-[5%] flex flex-col items-center gap-2 font-jetbrains text-[9px] uppercase tracking-[0.3em] text-text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.6 }}
            >
                Scroll
                <motion.span
                    className="block h-8 w-px bg-current"
                    animate={{ scaleY: [0.2, 1, 0.2], originY: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
}
