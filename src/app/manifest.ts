import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE.name,
        short_name: SITE.name,
        description: SITE.descriptionShort,
        start_url: "/",
        display: "standalone",
        background_color: "#0e1a26",
        theme_color: "#0e1a26",
        icons: [
            { src: "/icon-192", sizes: "192x192", type: "image/png" },
            { src: "/icon-512", sizes: "512x512", type: "image/png" },
        ],
    };
}
