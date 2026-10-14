"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { m as motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, DownloadIcon } from "@hugeicons/core-free-icons";
import { LinkedIn, Gmail } from "@ridemountainpig/svgl-react";
import { SOCIAL } from "@/config/links";

const ease = [0.16, 1, 0.3, 1] as const;

interface NodeDef {
    id: string;
    label: string;
    href: string;
    download?: string;
    external?: boolean;
    x: number;
    y: number;
    renderIcon: (size: number) => ReactNode;
}

const NODES: NodeDef[] = [
    { id: "email", label: "email", href: `mailto:${SOCIAL.email}`, x: 15, y: 30, renderIcon: (s) => <Gmail width={s} height={s} /> },
    { id: "linkedin", label: "linkedin", href: SOCIAL.linkedin, external: true, x: 70, y: 25, renderIcon: (s) => <LinkedIn width={s} height={s} /> },
    { id: "phone", label: "call", href: SOCIAL.phoneHref, x: 30, y: 65, renderIcon: (s) => <HugeiconsIcon icon={Call02Icon} size={s} /> },
    { id: "cv", label: "download cv", href: "/Suryash-Raj-Resume.pdf", download: "Suryash-Raj-Resume.pdf", x: 78, y: 65, renderIcon: (s) => <HugeiconsIcon icon={DownloadIcon} size={s} /> },
];

const EDGES: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 3], [0, 3],
];

/* ─── Constellation Canvas ─── */

function SignalBoard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50 });
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(true);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            setMouse({ x, y });
        });
    }, []);

    const distTo = (px: number, py: number) => {
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        return Math.sqrt(dx * dx + dy * dy);
    };

    return (
        <div
            ref={containerRef}
            className="relative h-[260px] w-full min-[480px]:h-[280px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                setMouse({ x: 50, y: 50 });
                setHoveredNode(null);
            }}
        >
            <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
                {EDGES.map(([a, b], i) => {
                    const na = NODES[a];
                    const nb = NODES[b];
                    const midX = (na.x + nb.x) / 2;
                    const midY = (na.y + nb.y) / 2;
                    const d = distTo(midX, midY);
                    const glow = hasMounted ? Math.max(0, 1 - d / 50) : 0;

                    return (
                        <line
                            key={`e-${i}`}
                            x1={`${na.x}%`}
                            y1={`${na.y}%`}
                            x2={`${nb.x}%`}
                            y2={`${nb.y}%`}
                            stroke="var(--text-muted)"
                            strokeWidth="1"
                            strokeDasharray="4 6"
                            style={{ opacity: 0.4 + glow * 0.4, transition: "opacity 0.3s ease-out" }}
                        />
                    );
                })}
            </svg>

            {NODES.map((node, i) => {
                const d = distTo(node.x, node.y);
                const isClose = hasMounted && d < 25;
                const isHovered = hoveredNode === node.id;
                const scale = isHovered ? 1.15 : isClose ? 1.05 : 1;
                const glowOpacity = isHovered ? 0.15 : isClose ? 0.06 : 0;

                return (
                    <motion.div
                        key={node.id}
                        className="absolute"
                        style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease }}
                    >
                        <div
                            className="absolute inset-0 -m-4 rounded-full bg-accent-primary"
                            style={{
                                opacity: glowOpacity,
                                transform: `scale(${scale * 1.8})`,
                                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                                filter: "blur(12px)",
                            }}
                        />

                        <a
                            href={node.href}
                            download={node.download}
                            target={node.external ? "_blank" : undefined}
                            rel={node.external ? "noopener noreferrer" : undefined}
                            aria-label={node.label}
                            className="relative flex h-12 w-12 items-center justify-center border border-border-default glass transition-all duration-300 hover:border-accent-primary min-[480px]:h-14 min-[480px]:w-14"
                            style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease-out, border-color 0.3s ease-out" }}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            {node.renderIcon(20)}
                        </a>

                        <div
                            className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap font-space text-[12px] text-text-tertiary transition-all duration-200"
                            style={{ opacity: isHovered ? 1 : 0, transform: `translate(-50%, ${isHovered ? 0 : -4}px)` }}
                        >
                            {node.label}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ─── Mobile Layout ─── */

function MobileConnections() {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            {NODES.map((node, i) => (
                <motion.a
                    key={node.id}
                    href={node.href}
                    download={node.download}
                    target={node.external ? "_blank" : undefined}
                    rel={node.external ? "noopener noreferrer" : undefined}
                    className="flex flex-col items-center gap-2 border border-border-default glass p-4 transition-colors duration-200 hover:border-accent-primary"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease }}
                >
                    {node.renderIcon(20)}
                    <span className="font-space text-[12px] text-text-tertiary">{node.label}</span>
                </motion.a>
            ))}
        </div>
    );
}

/* ─── Contact Form (mailto, no backend) ─── */

function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = `Portfolio inquiry from ${name || "a visitor"}`;
        const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
        window.location.href = `mailto:${SOCIAL.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const inputClass =
        "w-full border border-border-default glass px-3 py-2 font-space text-[14px] text-text-primary placeholder:text-text-muted transition-colors duration-200 focus-visible:border-accent-primary";

    return (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <textarea
                required
                rows={4}
                placeholder="What would you like to work on?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={inputClass}
            />
            <button
                type="submit"
                className="self-start border border-accent-primary px-4 py-2 font-jetbrains text-[12px] uppercase tracking-wider text-accent-primary transition-colors hover:bg-accent-primary hover:text-bg-primary"
            >
                SEND INQUIRY
            </button>
        </form>
    );
}

/* ─── Connections Section ─── */

export function Connections() {
    return (
        <section id="contact" className="mt-16 scroll-mt-16 min-[480px]:mt-24" aria-label="Get in touch">
            <motion.h2
                className="font-display text-[40px] leading-none text-text-primary"
                initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 24 }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease }}
            >
                GET IN TOUCH
            </motion.h2>

            <motion.p
                className="mt-4 max-w-md font-space text-[16px] leading-normal text-text-secondary"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
            >
                Open to opportunities where thoughtful operations, sharper marketing systems, and strong customer outcomes matter.
            </motion.p>

            <div className="mt-8 hidden min-[480px]:block">
                <SignalBoard />
            </div>
            <div className="mt-8 block min-[480px]:hidden">
                <MobileConnections />
            </div>

            <ContactForm />
        </section>
    );
}
