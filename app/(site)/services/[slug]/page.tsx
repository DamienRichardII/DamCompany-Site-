import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { OfferCard } from "@/components/site/OfferCard";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { OFFERS, PROCESS_STEPS, getOffer } from "@/content/offers";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return OFFERS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return {};
  return buildMetadata({ title: offer.title, description: offer.metaDescription, path: `/services/${offer.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();

  const others = OFFERS.filter((o) => o.slug !== offer.slug);

  return (
    <main id="main" className="v-page">
      <div className="v-container">
        <nav className="v-crumbs" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden>/</span>
          <Link href="/services">Services</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{offer.short}</span>
        </nav>

        <OfferCard offer={offer} size="lg" heading="h1" />

        <section className="v-section v-section-tight" aria-label="Présentation">
          <Reveal>
            <p className="v-lead">{offer.intro}</p>
          </Reveal>
          <ul className="v-why">
            {offer.why.map((w, i) => (
              <li key={w.title}>
                <Reveal delay={i * 0.06}>
                  <span className="v-why-i">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          {offer.slug === "carte-fidelite-3d" && (
            <div className="v-callout">
              <p>
                <strong>Testez-le :</strong> configurez votre carte en 3D et visualisez-la avant la mise en service.
              </p>
              <Link href="/carte-de-fidelite" className="v-btn v-btn-dark">
                Ouvrir le configurateur <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          )}
        </section>

        <section className="v-section v-section-tight" aria-label="Notre méthode">
          <SectionHead title="Notre méthode" sub="Quatre étapes, un interlocuteur unique." />
          <ol className="v-steps">
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.title}>
                <span>{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="v-section v-section-tight" aria-label="Autres services">
          <SectionHead title="Nos autres services" />
          <ul className="v-others">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`}>
                  <span className="v-num" aria-hidden>
                    {o.number}
                  </span>
                  <span>{o.short}</span>
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <CtaBand />
    </main>
  );
}
