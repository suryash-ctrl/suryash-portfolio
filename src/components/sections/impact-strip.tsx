"use client";

import { useRef, useState, useEffect } from "react";
import { m as motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

interface Stat {
    prefix?: string;
    value: number;
    suffix: string;
    label: string;
}

const STATS: Stat[] = [
    { prefix: "$", value: 50, suffix: "M+", label: "BILLING PORTFOLIO VALIDATED" },
    { value: 20, suffix: "", label: "GLOBAL ENTERPRISE ACCOUNTS" },
    { value: 99, suffix: "%", label: "DATA ACCURACY" },
    { prefix: "₹", value: 70, suffix: "L/MO", label: "NOBROKER REVENUE TARGET" },
    ];

function useCountUp(target: number, start: boolean) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        const controls = animate(0, target, {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setValue(v),
        });
        return () => controls.stop();
    }, [start, target]);
    return value;
}

function StatTile({ stat, index }: { stat: Stat; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const displayValue = useCountUp(stat.value, inView);

    const rotX = useMotionValue(0);
    const rotY = useMotionValue(0);
    const springX = useSpring(rotX, { stiffness: 300, damping: 22 });
    const springY = useSpring(rotY, { stiffness: 300, damping: 22 });

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotY.set(px * 10);
        rotX.set(py * -10);
    };
    const handleLeave = () => {
        rotX.set(0);
        rotY.set(0);
    };

    const formatted = stat.value % 1 === 0 ? Math.round(displayValue) : displayValue.toFixed(1);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08, ease }}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            style={{ rotateX: springX, rotateY: springY, transformPerspective: 600 }}
            className="flex flex-col gap-2 border border-border-default glass p-4"
        >
            <span className="font-jetbrains text-[26px] font-semibold leading-none text-accent-primary min-[480px]:text-[32px]">
                {stat.prefix}
                {formatted}
                {stat.suffix}
            </span>
            <span className="font-jetbrains text-[10px] uppercase tracking-wider text-text-tertiary">{stat.label}</span>
        </motion.div>
    );
}

export function ImpactStrip() {
    return (
        <section className="mt-24" aria-label="Impact snapshot">
            <motion.h2
                className="font-display text-[40px] leading-none text-text-primary"
                initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 24 }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease }}
            >
                IMPACT
            </motion.h2>

            <div className="mt-8 grid grid-cols-2 gap-3 min-[560px]:grid-cols-4">
                {STATS.map((stat, i) => (
                    <StatTile key={stat.label} stat={stat} index={i} />
                ))}
            </div>

            <p className="mt-4 font-space text-[11px] text-text-muted">Numbers from the CV, not live reporting.</p>
        </section>
    );
}
