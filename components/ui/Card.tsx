import Image from "next/image";
import styles from "./Card.module.css";
import { Tag } from "./Tag";
import { Bolt } from "../motion/Bolt";
import type { Project } from "@/content/projects";

/**
 * Carte projet : nom + secteur toujours visibles (jamais portés uniquement
 * par le hover, doc 06/12) ; hover/focus n'ajoute qu'un zoom d'image et un
 * éclair décoratif.
 */
export function Card({ project }: { project: Project }) {
  const content = (
    <>
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
    </>
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener"
        className={styles.card}
        aria-label={`Voir le projet ${project.name} (nouvel onglet)`}
      >
        {content}
      </a>
    );
  }

  return <div className={styles.card}>{content}</div>;
}
