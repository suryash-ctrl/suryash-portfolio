"use client";

import { useRef } from "react";
import { m as motion, useInView } from "framer-motion";
import { certifications, type Certification } from "@/content/certifications";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function CertCard({ cert, index }: { cert: Certification; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-30px" });
    const done = cert.status === "done";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08, ease }}
            whileHover={{ y: -2 }}
            className="flex flex-col gap-3 border border-border-default bg-bg-secondary p-4 transition-colors duration-200 hover:border-border-strong"
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-space text-[14px] leading-snug text-text-primary">{cert.title}</span>
                <span
                    className={cn(
                        "shrink-0 px-1.5 py-0.5 font-jetbrains text-[9px] uppercase tracking-wider",
                        done ? "bg-accent-tertiary/10 text-accent-tertiary" : "bg-status-warning/10 text-status-warning",
                    )}
                >
                    {done ? "DONE" : "IN PROGRESS"}
                </span>
            </div>
            {cert.issuer && <span className="font-jetbrains text-[11px] uppercase tracking-wide text-text-tertiary">{cert.issuer}</span>}
        </motion.div>
    );
}

export function Certifications() {
    return (
        <section className="mt-24" aria-label="Certifications">
            <motion.h2
                className="font-micro text-[40px] leading-none text-text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
            >
                CREDENTIALS
            </motion.h2>

            <div className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                {certifications.map((cert, i) => (
                    <CertCard key={cert.title} cert={cert} index={i} />
                ))}
            </div>
        </section>
    );
}
