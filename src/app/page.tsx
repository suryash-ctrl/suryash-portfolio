import { ScrollOrbitHero } from "@/components/sections/scroll-orbit-hero";
import { HeroIntro } from "@/components/sections/hero-intro";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { HeroBanner } from "@/components/sections/hero-banner";
import { HeroManifesto } from "@/components/sections/hero-manifesto";
import { Experience } from "@/components/sections/experience";
import { ImpactStrip } from "@/components/sections/impact-strip";
import { Capabilities } from "@/components/sections/capabilities";
import { Toolkit } from "@/components/sections/toolkit";
import { Work } from "@/components/sections/work";
import { Certifications } from "@/components/sections/certifications";
import { Connections } from "@/components/sections/connections";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/layout/motion-provider";

export default function Home() {
    return (
        <MotionProvider>
            <main className="mx-auto flex w-full max-w-2xl flex-col px-6 pt-0 pb-0">
                <ScrollOrbitHero />
                <div className="mt-12">
                    <HeroIntro />
                </div>
                <div className="mt-8">
                    <MarqueeStrip />
                </div>
                <div className="mt-8">
                    <HeroBanner />
                </div>
                <div className="mt-8">
                    <HeroManifesto />
                </div>
                <Experience />
                <ImpactStrip />
                <Work />
                <Capabilities />
                <Toolkit />
                <Certifications />
                <Connections />
                <Footer />
            </main>
        </MotionProvider>
    );
}
