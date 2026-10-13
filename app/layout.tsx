import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { spaceGrotesk, poppins } from "@/lib/fonts";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "DamCompany",
    description:
      "DamCompany, agence digitale à Aulnay-sous-Bois : sites internet, applications mobiles, IA, CRM 3D, reporting, motion design et supports de création.",
  }),
  metadataBase: new URL(SITE_URL),
  title: { default: "DamCompany", template: "%s — DamCompany" },
  applicationName: "DamCompany",
  authors: [{ name: "DamCompany", url: SITE_URL }],
};

export const viewport: Viewport = {
  themeColor: "#FBF9F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${poppins.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
