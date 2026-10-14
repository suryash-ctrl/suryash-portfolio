import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Not found",
    robots: { index: false, follow: true },
};

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-6">
            <div className="flex flex-col items-center gap-6 text-center">
                <pre className="font-jetbrains text-[12px] leading-snug text-accent-primary">
{`  _  _    ___  _  _
 | || |  / _ \\| || |
 | || |_| | | | || |_
 |__   _| | | |__   _|
    | | | |_| |  | |
    |_|  \\___/   |_|`}
                </pre>

                <p className="font-jetbrains text-[12px] uppercase tracking-wider text-text-muted">
                    PAGE NOT FOUND
                </p>

                <div className="font-space text-[16px] leading-normal text-text-secondary">
                    <p className="text-text-tertiary">
                        <span className="text-accent-primary">$</span> cd /requested-page
                    </p>
                    <p className="text-status-error">
                        bash: cd: /requested-page: No such file or directory
                    </p>
                </div>

                <Link
                    href="/"
                    className="mt-2 border border-border-default px-4 py-2 font-jetbrains text-[12px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
                >
                    cd ~
                </Link>
            </div>
        </main>
    );
}
