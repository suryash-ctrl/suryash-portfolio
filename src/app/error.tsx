"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
    return (
        <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-6">
            <div className="flex flex-col items-center gap-6 text-center">
                <pre className="font-jetbrains text-[12px] leading-snug text-status-error">
{`  _____ ____  ____
 | ____|  _ \\|  _ \\
 |  _| | |_) | |_) |
 | |___|  _ <|  _ <
 |_____|_| \\_\\_| \\_\\`}
                </pre>

                <p className="font-jetbrains text-[12px] uppercase tracking-wider text-text-muted">
                    SOMETHING WENT WRONG
                </p>

                <div className="font-space text-[16px] leading-normal text-text-secondary">
                    <p className="text-text-tertiary">
                        <span className="text-status-error">error</span>: unexpected runtime exception
                    </p>
                    <p className="text-text-tertiary">
                        <span className="text-accent-primary">$</span> retry --force
                    </p>
                </div>

                <button
                    onClick={reset}
                    className="mt-2 border border-border-default px-4 py-2 font-jetbrains text-[12px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
                >
                    TRY AGAIN
                </button>
            </div>
        </main>
    );
}
