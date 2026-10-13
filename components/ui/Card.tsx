import Image from "next/image";
import Link from "next/link";
import styles from "./Card.module.css";
import { Tag } from "./Tag";
import { Bolt } from "../motion/Bolt";
import type { Project } from "@/content/projects";

/**
 * Carte projet : nom + secteur toujours visibles (jamais portés uniquement
 * par le hover, doc 06/12) ; hover/focus n'ajoute qu'un zoom d'image et un
 * éclair décoratif. Chaque carte ouvre l'étude de cas du projet (doc 14) ;
 * le lien externe éventuel (project.url) vit dans la page d'étude de cas,
 * pas ici, pour éviter d'imbriquer deux liens.
 */
export function Card({ project }: { project: Project }) {
  return (
    <Link href={`/realisations/${project.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={project.cover}
          alt={`Interface du projet ${project.name}`}
          className={styles.image}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          loading="lazy"
        />
        <Bolt variant="spark" className={styles.spark} />
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{project.name}</span>
        <Tag>{project.sector}</Tag>
      </div>
    </Link>
  );
}
