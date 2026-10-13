import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PUBLISHED_PROJECTS } from "@/content/projects";

export function ProjectsStrip({ limit = 6 }: { limit?: number }) {
  const items = PUBLISHED_PROJECTS.slice(0, limit);
  if (!items.length) return null;
  return (
    <ul className="v-projects">
      {items.map((p) => (
        <li key={p.slug}>
          <Link href={`/realisations/${p.slug}`} className="v-project">
            <span className="v-project-img">
              <Image src={p.cover} alt={`Interface du projet ${p.name}`} sizes="(min-width: 900px) 360px, 80vw" />
              <b>{p.name}</b>
            </span>
            <span className="v-project-link">
              Voir le projet <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
