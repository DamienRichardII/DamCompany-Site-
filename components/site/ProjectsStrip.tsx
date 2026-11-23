import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SHOWCASE_PROJECTS } from "@/content/showcase";

/** Les 6 dernières réalisations : reprend le haut de la liste de la page Réalisations. */
const SHOWCASE = SHOWCASE_PROJECTS.slice(0, 6);

export function ProjectsStrip() {
  return (
    <ul className="v-projects">
      {SHOWCASE.map((p) => (
        <li key={p.file}>
          <Link href="/realisations" className="v-project">
            <span className="v-project-img">
              <Image
                src={`/images/projets/${p.file}.webp`}
                alt={`${p.type} ${p.name}`}
                fill
                sizes="(min-width: 900px) 360px, 80vw"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
              <b>{p.name}</b>
            </span>
            <span className="v-project-link">
              Voir les réalisations <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
