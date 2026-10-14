"use client";

import { useRef, useState } from "react";
import { m as motion, useInView } from "framer-motion";
import { toolkit } from "@/content/toolkit";

const ease = [0.16, 1, 0.3, 1] as const;

function Chip({ label, delay }: { label: string; delay: number }) {
    const [pressed, setPressed] = useState(false);
    return (
        <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.3, delay, ease }}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            style={{ scale: pressed ? 0.95 : 1 }}
            className="cursor-default select-none border border-border-default bg-bg-secondary px-2.5 py-1 font-jetbrains text-[11px] uppercase tracking-wide text-text-secondary transition-colors duration-150 hover:border-accent-primary hover:text-text-primary"
        >
            {label}
        </motion.span>
    );
}

function Group({ label, items, groupIndex }: { label: string; items: string[]; groupIndex: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: groupIndex * 0.06, ease }}
            className="flex flex-col gap-2.5"
        >
            <span className="font-jetbrains text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">{label}</span>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                    <Chip key={item} label={item} delay={0.1 + i * 0.03} />
                ))}
            </div>
        </motion.div>
    );
}

export function Toolkit() {
    return (
        <section className="mt-24" aria-label="Toolkit">
            <motion.h2
                className="font-micro text-[40px] leading-none text-text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
            >
                TOOLKIT
            </motion.h2>
            <p className="mt-3 font-space text-[14px] text-text-secondary">A practical mix of campaign platforms, operating metrics, and automation tools.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 min-[560px]:grid-cols-2">
                {toolkit.map((group, i) => (
                    <Group key={group.label} label={group.label} items={group.items} groupIndex={i} />
                ))}
            </div>
        </section>
    );
}
