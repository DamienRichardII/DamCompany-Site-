import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Card } from "@/components/ui/Card";
import { getProjectsByUniverse, type Universe } from "@/content/projects";
import styles from "./page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Réalisations",
  description:
    "La galerie des projets DamCompany : sites, applications, IA et automatisation livrés pour nos clients.",
  path: "/realisations",
});

function parseUniverse(value?: string): Universe | undefined {
  return value === "build" || value === "intelligence" ? value : undefined;
}

type RealisationsPageProps = {
  searchParams: Promise<{ universe?: string }>;
};

export default async function RealisationsPage({ searchParams }: RealisationsPageProps) {
  const { universe: rawUniverse } = await searchParams;
  const universe = parseUniverse(rawUniverse);
  const projects = getProjectsByUniverse(universe);

  return (
    <main className={styles.page}>
      <div className="dc-container">
        <div className={styles.header}>
          <Eyebrow>Réalisations</Eyebrow>
          <h1 className={styles.title}>Des idées devenues produits</h1>
          <p className={styles.text}>
            Une sélection de projets BUILD et INTELLIGENCE livrés par DamCompany.
          </p>
          <FilterTabs active={universe} />
        </div>

        {projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map((project) => (
              <Card key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Aucune réalisation dans cet univers pour le moment.</p>
        )}
      </div>
    </main>
  );
}
