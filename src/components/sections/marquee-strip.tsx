const TAGLINES = ["PERFORMANCE THAT CAN BE EXPLAINED", "OPERATIONS THAT HOLD UP", "DETAILS THAT MOVE REVENUE"];

export function MarqueeStrip() {
    const track = [...TAGLINES, ...TAGLINES, ...TAGLINES, ...TAGLINES];

    return (
        <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-border-subtle py-3">
            <div className="marquee flex w-max gap-10 whitespace-nowrap">
                {track.map((line, i) => (
                    <span key={i} className="flex items-center gap-10 font-jetbrains text-[11px] uppercase tracking-[0.15em] text-text-tertiary">
                        {line}
                        <span className="text-accent-primary">✳</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
