import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Réalisations mises en avant sur l'accueil (captures dans /public/images/realisations). */
const SHOWCASE = [
  { name: "Barber Truck", file: "barbertruck" },
  { name: "Top Hoops", file: "top-hoops" },
  { name: "CMR Personnalisation", file: "cmr-personnalisation" },
  { name: "CMakeup Beauty", file: "cmakeup-beauty" },
  { name: "Novra", file: "novra" },
  { name: "BC Villepinte 93", file: "bc-villepinte-93" },
] as const;

export function ProjectsStrip() {
  return (
    <ul className="v-projects">
      {SHOWCASE.map((p) => (
        <li key={p.file}>
          <Link href="/realisations" className="v-project">
            <span className="v-project-img">
              <Image
                src={`/images/realisations/${p.file}.webp`}
                alt={`Site ${p.name}`}
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
