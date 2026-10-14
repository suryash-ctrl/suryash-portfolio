import { Space_Grotesk, JetBrains_Mono, Micro_5 } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const micro5 = Micro_5({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-micro",
});
