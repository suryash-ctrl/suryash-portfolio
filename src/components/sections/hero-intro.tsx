import { DitherImage } from "@/components/ui/dither-image";
import { ScrambleButton } from "@/components/ui/scramble-button";
import { HeroHud } from "@/components/sections/hero-hud";

export function HeroIntro() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-6 min-[560px]:flex-row min-[560px]:gap-6">
                {/* Avatar — interactive dithered particle canvas */}
                <div className="aspect-square w-full shrink-0 min-[560px]:h-[300px] min-[560px]:w-[300px]">
                    <DitherImage src="/avatar-placeholder.svg" invert="auto" className="block h-full w-full" />
                </div>

                {/* Text + CTA */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
                    <h1 className="sr-only">Suryash Raj — digital marketing, operations, customer success</h1>

                    <div>
                        <span className="block font-micro text-[28px] leading-none text-text-primary min-[480px]:text-[32px]">Suryash Raj.</span>
                        <span className="mt-1 block font-jetbrains text-[12px] uppercase tracking-[0.15em] text-accent-primary">
                            Digital marketing · operations · customer success
                        </span>
                    </div>

                    <p className="font-space text-[16px] leading-normal text-text-secondary">
                        I work where performance marketing, reliable data, and customer relationships meet —
                        turning complex operating detail into clearer growth decisions.
                    </p>

                    <p className="font-space text-[16px] leading-normal text-text-secondary">
                        I care about the part most people skip: the handoff between a campaign, the data behind
                        it, and the person on the other side of the experience. With a foundation in{" "}
                        <span className="text-text-primary underline decoration-border-strong underline-offset-2">marketing and finance</span>, I bring an
                        operator&apos;s eye to acquisition, reporting, account health, and the systems that keep
                        teams moving together. Experience across{" "}
                        <span className="text-text-primary underline decoration-border-strong underline-offset-2">UPS Global Business Services</span>,{" "}
                        <span className="text-text-primary underline decoration-border-strong underline-offset-2">NoBroker Interiors</span>, and{" "}
                        <span className="text-text-primary underline decoration-border-strong underline-offset-2">Botmatic Solutions</span>.
                    </p>

                    <div className="flex gap-2 pt-1">
                        <ScrambleButton text="DOWNLOAD CV" href="/Suryash-Raj-Resume.pdf" download="Suryash-Raj-Resume.pdf" className="flex-1" />
                        <ScrambleButton text="GET IN TOUCH" href="#contact" className="flex-1" />
                    </div>
                </div>
            </div>

            <HeroHud />
        </div>
    );
}
