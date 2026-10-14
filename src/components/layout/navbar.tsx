"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { id: "work", label: "/WORK", short: "/WORK" },
    { id: "experience", label: "/EXPERIENCE", short: "/EXP" },
    { id: "capabilities", label: "/CAPABILITIES", short: "/CAP" },
    { id: "contact", label: "/CONTACT", short: "/CONTACT" },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                }
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
        );

        for (const el of elements) observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full bg-bg-primary/80 backdrop-blur-lg backdrop-saturate-180">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-2">
                <Link href="/" className="group focus-visible:text-accent-primary">
                    <span className={cn("font-micro text-[40px] leading-none transition-colors duration-200", isHome ? "text-accent-primary" : "text-text-primary group-hover:text-accent-primary")}>
                        <span className="hidden min-[360px]:inline">SURYASH</span>
                        <span className="inline min-[360px]:hidden">S</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2.5 min-[400px]:gap-4 min-[480px]:gap-6">
                    {NAV_LINKS.map((link) => {
                        const sectionId = link.id;
                        // bare "#id" is dead on any non-home route, so route home first
                        const href = isHome ? `#${link.id}` : `/#${link.id}`;
                        const isActive = activeSection === sectionId;

                        return (
                            <a
                                key={link.id}
                                href={href}
                                className={cn(
                                    "font-jetbrains text-[11px] font-normal uppercase leading-none transition-colors duration-200 focus-visible:text-accent-primary min-[480px]:text-[13px]",
                                    isActive ? "text-accent-primary" : "text-text-secondary hover:text-text-primary",
                                )}
                            >
                                <span className="min-[400px]:hidden">{link.short}</span>
                                <span className="hidden min-[400px]:inline">{link.label}</span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
