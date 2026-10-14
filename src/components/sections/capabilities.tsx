"use client";

import { useState, useRef } from "react";
import { m as motion, useInView, AnimatePresence } from "framer-motion";
import { capabilities, type Capability } from "@/content/capabilities";

const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Capability Row ─── */

function CapabilityRow({ capability, index, isOpen, onToggle, hasActive }: { capability: Capability; index: number; isOpen: boolean; onToggle: () => void; hasActive: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            className="group relative overflow-hidden border-b border-border-default"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08, ease }}
        >
            <motion.div
                className="absolute top-0 left-0 bottom-0 w-[3px] bg-accent-primary"
                initial={false}
                animate={{ scaleY: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease }}
                style={{ originY: 0 }}
            />

            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="animate-scan-once absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,var(--accent-primary)_50%,transparent_100%)] opacity-[0.03]" />
            </div>

            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                className={`flex w-full cursor-pointer items-center gap-4 py-6 pl-5 pr-2 text-left transition-opacity duration-300 min-[480px]:gap-6 min-[480px]:py-8 min-[480px]:pl-6 ${
                    hasActive && !isOpen ? "opacity-40" : "opacity-100"
                }`}
            >
                <span className={`font-jetbrains text-2xl font-medium transition-colors duration-300 ${isOpen ? "text-accent-primary" : "text-text-muted"}`}>
                    {capability.number}
                </span>

                <span className={`font-jetbrains text-[14px] font-semibold tracking-wide transition-colors duration-300 ${isOpen ? "text-text-primary" : "text-text-secondary"}`}>
                    {capability.title}
                </span>

                <span className="ml-auto shrink-0 pr-2">
                    <motion.span className="block font-jetbrains text-2xl leading-none text-text-muted" initial={false} animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2, ease }}>
                        +
                    </motion.span>
                </span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-5 pb-8 pl-5 pr-4 min-[480px]:pl-6">
                            <div className="min-[480px]:pl-[72px]">
                                <motion.p
                                    className="font-space text-[14px] leading-normal text-text-secondary"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.05, ease }}
                                >
                                    {capability.description}
                                </motion.p>

                                <div className="mt-4 flex flex-col gap-1.5">
                                    {capability.includes.map((item, i) => (
                                        <motion.span
                                            key={item}
                                            className="font-space text-[14px] leading-normal text-text-tertiary"
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.25, delay: 0.1 + i * 0.04, ease }}
                                        >
                                            · {item}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Capabilities Section ─── */

export function Capabilities() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="capabilities" className="mt-24 scroll-mt-16" aria-label="Capabilities">
            <motion.h2
                className="font-micro text-[40px] leading-none text-text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
            >
                CAPABILITIES
            </motion.h2>

            <div className="mt-8 border-t border-border-default">
                {capabilities.map((c, i) => (
                    <CapabilityRow key={c.number} capability={c} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} hasActive={openIndex !== null} />
                ))}
            </div>

            <div className="mt-6 flex flex-col-reverse items-start gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
                <motion.p
                    className="flex items-center gap-2 font-space text-[12px] text-accent-tertiary"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3, ease }}
                >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-tertiary animate-[status-pulse_2s_ease-in-out_infinite]" />
                    OPEN TO FULL-TIME ROLES AND PROJECT WORK
                </motion.p>
                <a
                    href="#contact"
                    className="border border-accent-primary px-4 py-2 font-jetbrains text-[12px] uppercase tracking-wider text-accent-primary transition-colors hover:bg-accent-primary hover:text-bg-primary"
                >
                    GET IN TOUCH
                </a>
            </div>
        </section>
    );
}
