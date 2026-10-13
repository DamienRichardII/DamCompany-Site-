import Link from "next/link";
import styles from "./CaseStudyNav.module.css";
import type { Project } from "@/content/projects";

type CaseStudyNavProps = {
  prev?: Project;
  next?: Project;
};

/**
 * Navigation projet précédent/suivant (doc 05 storyboard, doc 14-D.4).
 * N'affiche rien si un seul projet publié existe (pas de prev/next).
 */
export function CaseStudyNav({ prev, next }: CaseStudyNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.nav} aria-label="Autres réalisations">
      <div className={`dc-container ${styles.grid}`}>
        {prev && (
          <Link href={`/realisations/${prev.slug}`} className={styles.link}>
            <span className={styles.label}>← Projet précédent</span>
            <span className={styles.name}>{prev.name}</span>
          </Link>
        )}
        {next && (
          <Link href={`/realisations/${next.slug}`} className={`${styles.link} ${styles.next}`}>
            <span className={styles.label}>Projet suivant →</span>
            <span className={styles.name}>{next.name}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
