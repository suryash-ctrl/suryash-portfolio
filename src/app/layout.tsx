import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { spaceGrotesk, jetbrainsMono, micro5 } from "@/lib/fonts";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MotionPreferenceProvider } from "@/components/layout/motion-preference";
import { SpaceModeProvider } from "@/components/layout/space-mode";
import { Navbar } from "@/components/layout/navbar";
import { ThemeKeys } from "@/components/layout/theme-keys";
import { ThemePicker } from "@/components/ui/theme-picker";
import { CursorTrail } from "@/components/ui/cursor-trail";
import { Starfield } from "@/components/ui/starfield";
import { Astronaut } from "@/components/ui/astronaut";
import { Planets } from "@/components/ui/planets";
import { BlackHole } from "@/components/ui/black-hole";
import { Asteroids } from "@/components/ui/asteroids";
import { SpaceAudio } from "@/components/ui/space-audio";
import { SpaceToggle } from "@/components/ui/space-toggle";
import { SITE } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
    title: { default: SITE.title, template: `%s · ${SITE.name}` },
    description: SITE.description,
    metadataBase: new URL(SITE.url),
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    openGraph: {
        title: SITE.title,
        description: SITE.descriptionShort,
        url: SITE.url,
        siteName: SITE.domain,
        locale: SITE.locale,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE.title,
        description: SITE.descriptionShort,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: { canonical: SITE.url },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    jobTitle: SITE.jobTitle,
    worksFor: { "@type": "Organization", name: SITE.employer },
    address: { "@type": "PostalAddress", addressLocality: SITE.location.city, addressCountry: SITE.location.country },
    sameAs: SITE.sameAs,
    description: SITE.descriptionShort,
    image: `${SITE.url}/opengraph-image`,
    knowsAbout: [
        "Digital marketing",
        "Marketing operations",
        "Revenue assurance",
        "Contract pricing",
        "MIS reporting",
        "CRM systems",
        "AI-assisted workflow automation",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${micro5.variable}`} suppressHydrationWarning>
            <body className="flex min-h-screen flex-col" suppressHydrationWarning>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <ThemeProvider>
                    <MotionPreferenceProvider>
                        <SpaceModeProvider>
                            <a
                                href="#main"
                                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-60 focus:rounded focus:bg-accent-primary focus:px-3 focus:py-1.5 focus:font-space focus:text-[14px] focus:text-bg-primary"
                            >
                                skip → main
                            </a>
                            <Starfield />
                            <BlackHole />
                            <Planets />
                            <Asteroids />
                            <Astronaut />
                            <SpaceAudio />
                            <Navbar />
                            <ThemeKeys />
                            <CursorTrail />
                            {/* relative + z-10: without its own stacking context, this
                                in-flow content paints BEHIND the fixed starfield canvas
                                (z-index:0 or not, a fixed element always paints after
                                plain static content in the same stacking context) */}
                            <div id="main" className="relative z-10 flex-1">{children}</div>
                            <ThemePicker />
                            <SpaceToggle />
                        </SpaceModeProvider>
                    </MotionPreferenceProvider>
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
