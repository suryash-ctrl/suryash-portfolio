import { Space_Grotesk, JetBrains_Mono, Montserrat } from "next/font/google";

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

export const display = Montserrat({
  weight: ["200", "300", "400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});
