import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BigMark } from "@/components/brand/Brand";
import { DevicesDuo } from "@/components/visuals/Visuals";
import { ServiceIconRow, ServiceTiles } from "@/components/site/ServiceIconRow";
import { TrustBand } from "@/components/site/TrustBand";
import { ProjectsStrip } from "@/components/site/ProjectsStrip";
import { AboutBlock, TeamBlock } from "@/components/site/Blocks";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "DamCompany",
  description:
    "DamCompany, agence digitale à Aulnay-sous-Bois : sites internet, applications mobiles, IA, CRM 3D, reporting automatisé, motion design, carte fidélité 3D et supports de création.",
  path: "/",
});

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: SITE_URL,
    ...(SITE.email ? { email: SITE.email } : {}),
    telephone: SITE.phoneHref,
    description: SITE.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      postalCode: SITE.postalCode,
      addressCountry: "FR",
    },
    sameAs: [SITE.socials.tiktok, SITE.socials.instagram],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 01 — Accueil */}
      <section className="v-hero" aria-labelledby="hero-title">
        <div className="v-hero-card">
          <div className="v-hero-main">
            <div className="v-hero-left">
              <h1 id="hero-title" className="v-sr">
                DamCompany — agence digitale : sites internet, applications mobiles et IA
              </h1>
              <BigMark />
              <div className="v-hero-ctas">
                <Link href="/services" className="v-btn v-btn-dark v-btn-lg">
                  Découvrir nos services <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/contact" className="v-btn v-btn-light v-btn-lg">
                  Demander un devis <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
            <div className="v-hero-right" aria-hidden>
              <DevicesDuo className="vz-duo-hero" />
            </div>
          </div>

          <div className="v-hero-services-desktop">
            <ServiceIconRow />
          </div>
          <div className="v-hero-services-mobile">
            <h2 className="v-h3">Nos services</h2>
            <ServiceTiles />
          </div>

          <TrustBand />
        </div>
      </section>

      {/* Réalisations */}
      <section className="v-section v-section-tight" aria-label="Nos dernières réalisations">
        <div className="v-container">
          <Reveal>
            <SectionHead
              title="Nos dernières réalisations"
              actions={
                <Link href="/realisations" className="v-btn v-btn-light">
                  Toutes les réalisations <ArrowRight size={16} aria-hidden />
                </Link>
              }
            />
          </Reveal>
          <ProjectsStrip />
        </div>
      </section>

      {/* 10 — À propos / 11 — Équipe */}
      <section className="v-section v-section-tight">
        <div className="v-container v-stack">
          <Reveal>
            <AboutBlock />
          </Reveal>
          <Reveal>
            <TeamBlock />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
