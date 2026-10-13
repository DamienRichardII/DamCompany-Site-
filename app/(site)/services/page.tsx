import { OfferCard } from "@/components/site/OfferCard";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHead } from "@/components/site/SectionHead";
import { OFFERS } from "@/content/offers";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Nos services",
  description:
    "Sites internet, applications mobiles, IA, CRM 3D, reporting automatisé, motion design, carte fidélité 3D et supports de création : les services DamCompany.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="main" className="v-page">
      <div className="v-container">
        <SectionHead
          as="h1"
          title="Nos services"
          sub="Huit expertises pour construire, automatiser et faire rayonner votre activité."
        />
        <div className="v-offers-grid">
          {OFFERS.map((o) => (
            <div key={o.slug} className={o.visual === "web" || o.visual === "print" ? "v-span-2" : undefined}>
              <OfferCard offer={o} />
            </div>
          ))}
        </div>
      </div>
      <CtaBand />
    </main>
  );
}
