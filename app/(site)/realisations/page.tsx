import Image from "next/image";
import { SHOWCASE_PROJECTS } from "@/content/showcase";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Réalisations",
  description:
    "Les projets DamCompany : sites internet, applications, IA et portfolios livrés pour nos clients.",
  path: "/realisations",
});

export default function RealisationsPage() {
  return (
    <main id="main" className="v-rea">
      <div className="v-container">
        <h1 className="v-sr">Nos réalisations</h1>
        <ul className="v-rea-list">
          {SHOWCASE_PROJECTS.map((p, i) => (
            <li key={`${p.file}`}>
              <article className="v-rea-card">
                <Image
                  src={`/images/projets/${p.file}.webp`}
                  alt={`${p.name} — ${p.type}`}
                  fill
                  sizes="(min-width: 1400px) 1280px, 94vw"
                  priority={i < 2}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
                <div className="v-rea-info">
                  <h2>{p.name}</h2>
                  <span className="v-rea-type">{p.type}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
