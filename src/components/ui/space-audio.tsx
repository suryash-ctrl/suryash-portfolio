"use client";

import { useEffect, useRef } from "react";
import { useSound } from "@/components/layout/sound";

/** Procedurally synthesized deep-space drone — no external audio file.
 *  Detuned sub-oscillators beating against each other, a slow filter sweep,
 *  and a quiet filtered-noise layer for texture. Sound is on by default,
 *  so the AudioContext is created on mount rather than from a click —
 *  browsers still won't let it actually produce sound until a user
 *  gesture happens, so it starts suspended and resumes on the visitor's
 *  first click/key/touch/scroll, whichever comes first. */
export function SpaceAudio() {
    const { enabled } = useSound();
    const ctxRef = useRef<AudioContext | null>(null);
    const stopFnRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!enabled) {
            stopFnRef.current?.();
            stopFnRef.current = null;
            return;
        }

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        ctxRef.current = ctx;

        const master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);
        master.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2.5);

        // Detuned low drone — three oscillators beating slowly against each other.
        const droneFreqs = [27.5, 55, 58.5];
        const oscillators = droneFreqs.map((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = i === 0 ? "sine" : "triangle";
            osc.frequency.value = freq;
            const gain = ctx.createGain();
            gain.gain.value = i === 0 ? 0.6 : 0.3;
            osc.connect(gain);
            return { osc, gain };
        });

        // Slow lowpass sweep for a "moving through space" feel.
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400;
        filter.Q.value = 0.7;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.04;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 220;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        for (const { gain } of oscillators) gain.connect(filter);
        filter.connect(master);

        // Quiet filtered noise for cosmic-radiation texture.
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.value = 900;
        noiseFilter.Q.value = 0.5;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.035;
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);

        const now = ctx.currentTime;
        for (const { osc } of oscillators) osc.start(now);
        lfo.start(now);
        noise.start(now);

        // Autoplay policy: the context starts suspended until a real user
        // gesture. Resume on the first one, then stop listening.
        const GESTURE_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
        let resumed = ctx.state !== "suspended";
        const resume = () => {
            if (resumed) return;
            resumed = true;
            ctx.resume().catch(() => {});
            for (const ev of GESTURE_EVENTS) window.removeEventListener(ev, resume);
        };
        if (!resumed) {
            for (const ev of GESTURE_EVENTS) window.addEventListener(ev, resume, { once: true, passive: true });
        }

        stopFnRef.current = () => {
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(master.gain.value, t);
            master.gain.linearRampToValueAtTime(0, t + 1.2);
            setTimeout(() => {
                for (const { osc } of oscillators) osc.stop();
                lfo.stop();
                noise.stop();
                ctx.close();
            }, 1300);
        };

        return () => {
            stopFnRef.current?.();
            stopFnRef.current = null;
        };
    }, [enabled]);

    return null;
}
