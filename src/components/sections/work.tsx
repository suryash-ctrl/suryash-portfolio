"use client";

import { useRef } from "react";
import { m as motion, useInView } from "framer-motion";
import { work, type WorkItem } from "@/content/work";
import { WorkThumbnail } from "@/components/ui/work-thumbnail";

const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Work Card ─── */

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            className="group relative flex flex-col overflow-hidden border border-border-default bg-bg-secondary transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-border-strong"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08, ease }}
        >
            <div className="dot-grid-overlay pointer-events-none absolute inset-0 z-10 transition-opacity duration-300" aria-hidden="true" />

            <div className="relative aspect-16/10 w-full bg-bg-tertiary">
                <WorkThumbnail slug={item.slug} title={item.title} />
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-jetbrains text-[13px] font-semibold leading-snug text-text-primary">{item.title}</h3>
                </div>

                <span className="w-fit bg-accent-primary/10 px-1.5 py-0.5 font-jetbrains text-[9px] uppercase tracking-wider text-accent-primary">{item.group}</span>

                <p className="line-clamp-3 font-space text-[13px] leading-normal text-text-secondary">{item.description}</p>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {item.tools.map((tool) => (
                        <span key={tool} className="bg-bg-tertiary px-1.5 py-0.5 font-jetbrains text-[10px] uppercase tracking-wider text-text-tertiary">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Work Section ─── */

export function Work() {
    return (
        <section id="work" className="mt-24 scroll-mt-16" aria-label="Work">
            <motion.h2
                className="font-display text-[40px] leading-none text-text-primary"
                initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 24 }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease }}
            >
                WORK
            </motion.h2>

            <div className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                {work.map((item, i) => (
                    <WorkCard key={item.slug} item={item} index={i} />
                ))}
            </div>
        </section>
    );
}
