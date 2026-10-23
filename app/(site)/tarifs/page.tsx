import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { PRICE_GROUPS } from "@/content/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tarifs",
  description:
    "Les tarifs DamCompany : site vitrine 250 €, site de réservation 400 €, boutique en ligne 600 €, abonnements mensuels, cartes de fidélité, flyers, dashboard business, et devis pour les applications, CRM 3D et IA.",
  path: "/tarifs",
});

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

export default function TarifsPage() {
  return (
    <main id="main" className="v-page">
      <div className="v-container">
        <SectionHead
          as="h1"
          title="Tarifs"
          sub="Des tarifs clairs pour chaque besoin. Les projets sur mesure sont chiffrés sur devis."
        />
        <div className="v-pricing">
          {PRICE_GROUPS.map((g) => (
            <Reveal key={g.id}>
              <section className="v-card v-pgroup" aria-labelledby={`p-${g.id}`}>
                <h2 id={`p-${g.id}`}>{g.title}</h2>
                {g.sub && <p className="v-pgroup-sub">{g.sub}</p>}
                <ul className="v-plist">
                  {g.items.map((it) => (
                    <li key={it.name}>
                      <span className="v-pname">
                        {it.name}
                        {it.note && <small>{it.note}</small>}
                      </span>
                      {it.price === null ? (
                        <Link href={`/contact?service=${encodeURIComponent(it.name)}`} className="v-pquote">
                          Sur devis <ArrowRight size={14} aria-hidden />
                        </Link>
                      ) : (
                        <span className="v-pprice">
                          {euro(it.price)}
                          {it.unit && <small>{it.unit}</small>}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
      <CtaBand title="Une question sur un tarif ?" text="Écrivez-nous ou appelez-nous : nous vous répondons rapidement." />
    </main>
  );
}
