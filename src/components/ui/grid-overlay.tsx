/** Faint full-page drafting grid behind everything — the structural layer
 *  the particle field and the content sit on. */
export function GridOverlay() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
            style={{
                backgroundImage:
                    "linear-gradient(to right, color-mix(in oklab, var(--border-subtle) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border-subtle) 70%, transparent) 1px, transparent 1px)",
                backgroundSize: "75px 75px",
                backgroundPosition: "center top",
            }}
        />
    );
}
