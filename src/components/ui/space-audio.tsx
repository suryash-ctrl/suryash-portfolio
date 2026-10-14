"use client";

import { useEffect } from "react";
import { useSound } from "@/components/layout/sound";

// Real user-activation events only. Browsers do not count scroll/wheel or
// touchstart as permission to play audio — listening for those (as the first
// version did) marked the context "unlocked" while resume() was rejected,
// then removed every listener, so a visitor who scrolled first never heard
// anything.
const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend", "click"] as const;

/** Procedurally synthesized ambient pad — no external audio file. A soft
 *  chord (A · C · E · A, 110–220 Hz — low enough to feel warm, high enough
 *  for laptop and phone speakers to actually reproduce, which the old
 *  27–58 Hz drone wasn't), slowly detuning against itself under a breathing
 *  lowpass filter, with a faint band of filtered noise for air. */
export function SpaceAudio() {
    const { enabled, setUnlocked } = useSound();

    useEffect(() => {
        if (!enabled) return;

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();

        const master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1400;
        filter.Q.value = 0.6;
        filter.connect(master);

        const breath = ctx.createOscillator();
        breath.frequency.value = 0.06;
        const breathDepth = ctx.createGain();
        breathDepth.gain.value = 700;
        breath.connect(breathDepth);
        breathDepth.connect(filter.frequency);

        const chord = [110, 130.81, 164.81, 220];
        const voices = chord.flatMap((freq, i) =>
            [-1, 1].map((side) => {
                const osc = ctx.createOscillator();
                osc.type = i === 0 ? "sine" : "triangle";
                osc.frequency.value = freq;
                osc.detune.value = side * (4 + i * 1.5);
                // slow drift so the voices beat against each other
                const drift = ctx.createOscillator();
                drift.frequency.value = 0.03 + i * 0.011;
                const driftDepth = ctx.createGain();
                driftDepth.gain.value = 6;
                drift.connect(driftDepth);
                driftDepth.connect(osc.detune);
                const g = ctx.createGain();
                g.gain.value = (i === 0 ? 0.22 : 0.13) / 2;
                osc.connect(g);
                g.connect(filter);
                return [osc, drift];
            }),
        ).flat();

        const noiseLen = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        const air = ctx.createBiquadFilter();
        air.type = "bandpass";
        air.frequency.value = 2600;
        air.Q.value = 0.8;
        const airGain = ctx.createGain();
        airGain.gain.value = 0.012;
        noise.connect(air);
        air.connect(airGain);
        airGain.connect(master);

        const t0 = ctx.currentTime;
        for (const node of voices) node.start(t0);
        breath.start(t0);
        noise.start(t0);

        const fadeIn = () => {
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(master.gain.value, t);
            master.gain.linearRampToValueAtTime(0.5, t + 3);
            // warp-in: filter opens from a muffled rumble while the noise bed swells and settles
            filter.frequency.cancelScheduledValues(t);
            filter.frequency.setValueAtTime(120, t);
            filter.frequency.exponentialRampToValueAtTime(1400, t + 5);
            airGain.gain.cancelScheduledValues(t);
            airGain.gain.setValueAtTime(0.0, t);
            airGain.gain.linearRampToValueAtTime(0.05, t + 2);
            airGain.gain.linearRampToValueAtTime(0.012, t + 6);
        };

        let unlocked = false;
        const tryUnlock = () => {
            if (unlocked) return;
            ctx.resume()
                .then(() => {
                    if (ctx.state !== "running" || unlocked) return;
                    unlocked = true;
                    setUnlocked(true);
                    fadeIn();
                    for (const ev of UNLOCK_EVENTS) window.removeEventListener(ev, tryUnlock);
                })
                .catch(() => {
                    // not a qualifying gesture — keep listening for the next one
                });
        };

        if (ctx.state === "running") {
            unlocked = true;
            setUnlocked(true);
            fadeIn();
        } else {
            for (const ev of UNLOCK_EVENTS) window.addEventListener(ev, tryUnlock, { passive: true });
        }

        return () => {
            for (const ev of UNLOCK_EVENTS) window.removeEventListener(ev, tryUnlock);
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(master.gain.value, t);
            master.gain.linearRampToValueAtTime(0, t + 0.8);
            setTimeout(() => {
                for (const node of voices) node.stop();
                breath.stop();
                noise.stop();
                ctx.close();
            }, 900);
        };
    }, [enabled, setUnlocked]);

    return null;
}
