import { AboutBlock, TeamBlock } from "@/components/site/Blocks";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHead } from "@/components/site/SectionHead";
import { PROCESS_STEPS } from "@/content/offers";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "À propos",
  description:
    "DamCompany est une agence digitale basée à Aulnay-sous-Bois : sites internet, applications mobiles, outils digitaux et solutions innovantes pour les entreprises.",
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <main id="main" className="v-page">
      <div className="v-container v-stack">
        <AboutBlock heading="h1" />
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
        <TeamBlock />
      </div>
      <CtaBand />
    </main>
  );
}
