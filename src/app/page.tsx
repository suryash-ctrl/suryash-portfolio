import { HeroAstronaut } from "@/components/sections/hero-astronaut";
import { HeroIntro } from "@/components/sections/hero-intro";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { HeroBanner } from "@/components/sections/hero-banner";
import { HeroManifesto } from "@/components/sections/hero-manifesto";
import { Experience } from "@/components/sections/experience";
import { ImpactStrip } from "@/components/sections/impact-strip";
import { Capabilities } from "@/components/sections/capabilities";
import { Toolkit } from "@/components/sections/toolkit";
import { Work } from "@/components/sections/work";
import { Connections } from "@/components/sections/connections";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MotionProvider } from "@/components/layout/motion-provider";

export default function Home() {
  return (
    <MotionProvider>
      <main className="mx-auto flex w-full max-w-2xl flex-col px-6 pt-0 pb-0">
        <HeroAstronaut />
        <div className="mt-12">
          <ScrollReveal variant="zoom">
            <HeroIntro />
          </ScrollReveal>
        </div>
        <div className="mt-8">
          <ScrollReveal variant="slide">
            <MarqueeStrip />
          </ScrollReveal>
        </div>
        <div className="mt-8">
          <ScrollReveal variant="wipe">
            <HeroBanner />
          </ScrollReveal>
        </div>
        <div className="mt-8">
          <ScrollReveal variant="rise">
            <HeroManifesto />
          </ScrollReveal>
        </div>
        <ScrollReveal variant="wipe">
          <Experience />
        </ScrollReveal>
        <ScrollReveal variant="zoom">
          <ImpactStrip />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <Work />
        </ScrollReveal>
        <ScrollReveal variant="slide">
          <Capabilities />
        </ScrollReveal>
        <ScrollReveal variant="wipe">
          <Toolkit />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <Connections />
        </ScrollReveal>
        <Footer />
      </main>
    </MotionProvider>
  );
}
