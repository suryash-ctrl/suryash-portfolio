"use client";

/**
 * Generative node-graph thumbnails for work cards — zero images. Every
 * project here is an automation workflow, so one visual language (nodes +
 * edges, in the spirit of a pipeline diagram) fits all of them; the slug
 * seeds a deterministic layout so each card still reads as distinct.
 */

function hashSeed(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed: number) {
    let a = seed;
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function monogramFor(title: string): string {
    const words = title.split(/[\s&]+/).filter(Boolean);
    const letters = words.slice(0, 2).map((w) => w[0]);
    return letters.join("").toUpperCase();
}

export function WorkThumbnail({ slug, title }: { slug: string; title: string }) {
    const rand = mulberry32(hashSeed(slug));
    const nodeCount = 8 + Math.floor(rand() * 3);

    const nodes = Array.from({ length: nodeCount }, () => ({
        x: 40 + rand() * 320,
        y: 30 + rand() * 190,
        r: 2.5 + rand() * 2.5,
    }));

    const edges: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
        const next = (i + 1 + Math.floor(rand() * 2)) % nodeCount;
        if (next !== i) edges.push([i, next]);
    }
    // a couple of extra cross-links for density
    for (let i = 0; i < 3; i++) {
        const a = Math.floor(rand() * nodeCount);
        const b = Math.floor(rand() * nodeCount);
        if (a !== b) edges.push([a, b]);
    }

    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-bg-tertiary">
            <svg className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.02]" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
                {edges.map(([a, b], i) => (
                    <line key={`e-${i}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.4" />
                ))}
                {nodes.map((node, i) => (
                    <g key={`n-${i}`}>
                        <circle cx={node.x} cy={node.y} r={node.r * 3} fill="var(--accent-primary)" fillOpacity="0.04" />
                        <circle cx={node.x} cy={node.y} r={node.r} fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="0.75" opacity="0.8" />
                        <circle cx={node.x} cy={node.y} r="1" fill="var(--accent-primary)" fillOpacity="0.6" />
                    </g>
                ))}
            </svg>

            <div className="relative z-10 flex flex-col items-center gap-1.5">
                <span className="font-jetbrains text-[11px] font-semibold tracking-widest text-accent-primary opacity-90">{monogramFor(title)}</span>
                <div className="h-px w-8 bg-accent-primary/30" />
            </div>
        </div>
    );
}
