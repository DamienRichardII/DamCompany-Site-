import type { ReactNode } from "react";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <a href="#main" className="v-skip">
        Aller au contenu
      </a>
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </LenisProvider>
  );
}
