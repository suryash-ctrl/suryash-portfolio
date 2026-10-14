"use client";

import { useRef } from "react";
import Image from "next/image";
import { m as motion, useScroll, useTransform, useSpring } from "framer-motion";

/** Opening section: the photo sits in a circular "viewport" and turns a
 *  full 360° as you scroll through the section — the photo is top-down, so
 *  turning it reads as the camera orbiting over the astronaut from the same
 *  height. The section is 260vh tall with a sticky inner frame, so the
 *  rotation plays out over ~1.6 screens of scrolling before the rest of the
 *  page continues. */
export function ScrollOrbitHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

    const rotate = useTransform(progress, [0, 1], [0, 360]);
    const scale = useTransform(progress, [0, 0.5, 1], [1.08, 1, 0.92]);
    const titleOpacity = useTransform(progress, [0, 0.22], [1, 0]);
    const titleY = useTransform(progress, [0, 0.22], [0, -40]);
    const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);
    const degrees = useTransform(rotate, (v) => `${Math.round(v)}°`);

    return (
        <section ref={sectionRef} className="relative left-1/2 w-screen -translate-x-1/2" style={{ height: "260vh" }} aria-label="Intro">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
                {/* circular viewport — the image is a square larger than the
                    circle's inscribed area, so the frame never shows a corner
                    while it rotates */}
                <motion.div
                    className="relative overflow-hidden rounded-full shadow-[0_0_80px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
                    style={{ width: "min(86vw, 74vh)", height: "min(86vw, 74vh)", scale }}
                >
                    <motion.div className="absolute inset-0" style={{ rotate }}>
                        <Image
                            src="/hero-astronaut.jpg"
                            alt="An astronaut in an orange suit lying in a field of wildflowers beside a cat, seen from above"
                            fill
                            priority
                            sizes="(max-width: 768px) 86vw, 74vh"
                            className="object-cover"
                        />
                    </motion.div>
                    {/* soft vignette so the edge reads as a lens, not a crop */}
                    <div
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{ boxShadow: "inset 0 0 60px 20px rgba(0,0,0,0.45)" }}
                    />
                </motion.div>

                <motion.div className="pointer-events-none absolute top-[12vh] text-center" style={{ opacity: titleOpacity, y: titleY }}>
                    <span className="block font-micro text-[44px] leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] min-[560px]:text-[64px]">
                        Suryash Raj.
                    </span>
                    <span className="mt-2 block font-jetbrains text-[11px] uppercase tracking-[0.2em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                        Digital marketing · operations · customer success
                    </span>
                </motion.div>

                <motion.span className="absolute right-6 bottom-8 font-jetbrains text-[11px] tabular-nums text-text-tertiary">
                    {degrees}
                </motion.span>

                <motion.div
                    className="pointer-events-none absolute bottom-8 flex flex-col items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.2em] text-text-tertiary"
                    style={{ opacity: hintOpacity }}
                >
                    Scroll to orbit
                    <motion.span
                        className="block h-6 w-px bg-current"
                        animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
