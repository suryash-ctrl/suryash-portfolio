"use client";

import { useRef } from "react";
import Image from "next/image";
import { m as motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useParallax } from "@/components/layout/parallax";
import { CinemaCat } from "@/components/sections/cinema-cat";

/** One photo, five "shots". Each shot is a camera position over the image
 *  — zoom, rotation, and a focus point in image coordinates (0..1 of the
 *  square the photo is cropped to). Scrolling moves the camera between
 *  them; the photo is shot top-down, so rotating reads as orbiting. */
interface Shot {
    at: number;
    scale: number;
    rotate: number;
    fx: number;
    fy: number;
    label: string;
    title: string;
}

const SHOTS: Shot[] = [
    { at: 0.0, scale: 0.75, rotate: 0, fx: 0.5, fy: 0.5, label: "01", title: "The field" },
    { at: 0.24, scale: 1.45, rotate: 28, fx: 0.486, fy: 0.15, label: "02", title: "The visor" },
    { at: 0.48, scale: 1.5, rotate: 80, fx: 0.69, fy: 0.32, label: "03", title: "The companion" },
    { at: 0.72, scale: 1.35, rotate: 200, fx: 0.78, fy: 0.76, label: "04", title: "Wildflowers" },
    { at: 1.0, scale: 0.9, rotate: 360, fx: 0.5, fy: 0.5, label: "05", title: "Full orbit" },
];

/** Square side of the camera "stage", as a multiple of the viewport's
 *  larger side. Comfortably bigger than the viewport diagonal (~1.414),
 *  so there's room to rotate before the coverage clamp has to kick in. */
const STAGE = 1.5;
/** Extra headroom over the bare coverage minimum — the idle drift and the
 *  cursor parallax both nudge the stage a little on top of the camera. */
const MARGIN = 1.08;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function cameraAt(p: number) {
    let i = 0;
    while (i < SHOTS.length - 2 && p > SHOTS[i + 1].at) i++;
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    const t = easeInOut(Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at))));
    const lerp = (x: number, y: number) => x + (y - x) * t;

    const w = typeof window === "undefined" ? 1280 : window.innerWidth;
    const h = typeof window === "undefined" ? 800 : window.innerHeight;
    const S = STAGE * Math.max(w, h);

    const rotate = lerp(a.rotate, b.rotate);
    const rad = (rotate * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));

    // The viewport, seen in the rotated image's own axes, spans these
    // widths — the stage (scaled) must be at least that big to cover it.
    const needX = (w * cos + h * sin) / S;
    const needY = (w * sin + h * cos) / S;
    const scale = Math.max(lerp(a.scale, b.scale), Math.max(needX, needY) * MARGIN);

    // Keep the focus point far enough from the image edge that the visible
    // window never runs off the photo.
    const ex = (needX * MARGIN) / (2 * scale);
    const ey = (needY * MARGIN) / (2 * scale);
    const fx = Math.min(1 - ex, Math.max(ex, lerp(a.fx, b.fx)));
    const fy = Math.min(1 - ey, Math.max(ey, lerp(a.fy, b.fy)));

    // Translate so the focus point lands on the viewport centre, after the
    // stage has been rotated and scaled about its own centre.
    const dx = fx - 0.5;
    const dy = fy - 0.5;
    const rc = Math.cos(rad);
    const rs = Math.sin(rad);
    const x = -scale * (rc * dx - rs * dy) * 100;
    const y = -scale * (rs * dx + rc * dy) * 100;

    return { x, y, scale, rotate };
}

function ShotCaption({ shot, index, progress }: { shot: Shot; index: number; progress: MotionValue<number> }) {
    const prev = index === 0 ? -1 : (SHOTS[index - 1].at + shot.at) / 2;
    const next = index === SHOTS.length - 1 ? 2 : (shot.at + SHOTS[index + 1].at) / 2;
    const opacity = useTransform(progress, [prev, prev + 0.04, next - 0.04, next], [0, 1, 1, 0]);
    const y = useTransform(progress, [prev, prev + 0.04, next - 0.04, next], [14, 0, 0, -14]);

    return (
        <motion.div className="absolute bottom-[calc(10vh+28px)] left-6 min-[560px]:left-10" style={{ opacity, y }}>
            <span className="block font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/70">
                Shot {shot.label} / 0{SHOTS.length}
            </span>
            <span className="mt-1 block font-micro text-[28px] leading-none text-white min-[560px]:text-[36px]">{shot.title}</span>
        </motion.div>
    );
}

export function ScrollCinema() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.5 });
    const parallax = useParallax(18);

    const x = useTransform(progress, (p) => `${cameraAt(p).x}%`);
    const y = useTransform(progress, (p) => `${cameraAt(p).y}%`);
    const scale = useTransform(progress, (p) => cameraAt(p).scale);
    const rotate = useTransform(progress, (p) => cameraAt(p).rotate);

    const barHeight = useTransform(progress, [0, 0.05, 0.94, 1], ["0vh", "10vh", "10vh", "0vh"]);
    const titleOpacity = useTransform(progress, [0, 0.1], [1, 0]);
    const titleY = useTransform(progress, [0, 0.1], [0, -30]);
    const hintOpacity = useTransform(progress, [0, 0.04], [1, 0]);
    const exitFade = useTransform(progress, [0.9, 1], [0, 1]);
    const timeline = useTransform(progress, [0, 1], ["0%", "100%"]);
    // Depth-of-field: softens slightly as the camera pushes in, which also
    // smooths the source photo's JPEG blocking at close-up magnification.
    const lensFilter = useTransform(scale, (s) => `saturate(1.08) contrast(1.06) blur(${Math.min(1.1, Math.max(0, (s - 1) * 1.6)).toFixed(2)}px)`);

    return (
        <section ref={sectionRef} className="relative left-1/2 w-screen -translate-x-1/2" style={{ height: "520vh" }} aria-label="Intro">
            <div className="sticky top-0 h-screen overflow-hidden bg-black">
                {/* camera — cursor parallax, then idle drift, then the scroll-driven shot */}
                <motion.div className="absolute inset-0" style={{ x: parallax.x, y: parallax.y }}>
                    <motion.div
                        className="absolute inset-0"
                        animate={{ scale: [1, 1.035, 1], x: [0, 8, -6, 0], y: [0, -6, 4, 0] }}
                        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="absolute top-1/2 left-1/2"
                            style={{
                                width: `${STAGE * 100}vmax`,
                                height: `${STAGE * 100}vmax`,
                                marginLeft: `-${STAGE * 50}vmax`,
                                marginTop: `-${STAGE * 50}vmax`,
                                x,
                                y,
                                scale,
                                rotate,
                            }}
                        >
                            <motion.div className="absolute inset-0" style={{ filter: lensFilter }}>
                                <Image
                                    src="/hero-astronaut-base.jpg"
                                    alt="An astronaut in an orange suit lying in a field of wildflowers beside a cat, seen from above"
                                    fill
                                    priority
                                    unoptimized
                                    className="object-cover"
                                />
                                <CinemaCat />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* grade: vignette + film grain */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }}
                />
                <div className="cinema-grain pointer-events-none absolute -inset-[50%] opacity-[0.13] mix-blend-overlay" />

                {/* letterbox bars */}
                <motion.div className="pointer-events-none absolute inset-x-0 top-0 bg-black" style={{ height: barHeight }} />
                <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black" style={{ height: barHeight }} />

                {/* opening title */}
                <motion.div
                    className="pointer-events-none absolute inset-x-0 top-[18vh] text-center"
                    style={{ opacity: titleOpacity, y: titleY }}
                >
                    <span className="block font-micro text-[48px] leading-none text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] min-[560px]:text-[80px]">
                        Suryash Raj.
                    </span>
                    <span className="mt-3 block font-jetbrains text-[11px] uppercase tracking-[0.25em] text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                        Digital marketing · operations · customer success
                    </span>
                </motion.div>

                {SHOTS.slice(1).map((shot, i) => (
                    <ShotCaption key={shot.label} shot={shot} index={i + 1} progress={progress} />
                ))}

                {/* scroll hint */}
                <motion.div
                    className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/80"
                    style={{ opacity: hintOpacity }}
                >
                    Scroll to roll film
                    <motion.span
                        className="block h-7 w-px bg-white/80"
                        animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* film timeline */}
                <div className="pointer-events-none absolute inset-x-6 bottom-[calc(10vh+12px)] h-px bg-white/15 min-[560px]:inset-x-10">
                    <motion.div className="h-full bg-white/70" style={{ width: timeline }} />
                </div>

                {/* clean hand-off into the rest of the page */}
                <motion.div className="pointer-events-none absolute inset-0 bg-bg-primary" style={{ opacity: exitFade }} />
            </div>
        </section>
    );
}
