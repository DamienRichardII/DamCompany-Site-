import type { Metadata } from "next";
import "./globals.css";
import { spaceGrotesk, poppins } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = buildMetadata({
  title: "DamCompany",
  description:
    "DamCompany — agence digitale : création de sites, applications, IA, data et automatisation. De l'idée au produit intelligent.",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${poppins.variable}`}>
      <body>
        <LenisProvider>
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
