import { Poppins, Space_Grotesk } from "next/font/google";

// Display monumental (titres) — doc 06. Space Grotesk retenu (Google Fonts,
// licence SIL OFL, self-host via next/font) plutôt que Clash Display/Satoshi
// qui exigent une licence commerciale distincte non confirmée à ce stade.
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Texte courant — conservé de l'identité existante.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});
