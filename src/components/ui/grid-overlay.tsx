/** Faint full-page drafting grid behind everything — the structural layer
 *  the particle field and the content sit on. */
export function GridOverlay() {
  return (
    <>
      {/* slow colour blobs: they give the glass cards something to blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="blob-a absolute -left-[10vw] top-[20vh] size-[46vw] rounded-full opacity-[0.28] blur-[90px]"
          style={{ background: "oklch(0.62 0.16 200)" }}
        />
        <div
          className="blob-b absolute -right-[8vw] top-[55vh] size-[40vw] rounded-full opacity-[0.22] blur-[100px]"
          style={{ background: "oklch(0.55 0.22 300)" }}
        />
      </div>
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
    </>
  );
}
