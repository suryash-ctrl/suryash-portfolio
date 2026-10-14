"use client";

import { m as motion } from "framer-motion";

/** The cat, cut out of the photo, placed back at its exact original spot
 *  on the cinema stage (positions are % of the square the photo is cropped
 *  to — the photo is 1080×1312, centre-cropped to 1080×1080, so stage
 *  y = (photo y − 116) / 1080). It then wanders a slow loop out into the
 *  flowers and back, turning toward where it's heading, breathing as it
 *  goes. The spot it came from is patched with grass in the base image, so
 *  there's no second cat underneath. */
export function CinemaCat() {
    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{ left: "59.72%", top: "16.11%", width: "19.44%", height: "30.09%" }}
            animate={{
                x: ["0%", "16%", "32%", "26%", "8%", "0%"],
                y: ["0%", "8%", "26%", "44%", "22%", "0%"],
                rotate: [0, -12, -26, -10, 8, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.42, 0.62, 0.84, 1] }}
        >
            <motion.img
                src="/hero-cat.png"
                alt=""
                className="h-full w-full select-none"
                draggable={false}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
}
