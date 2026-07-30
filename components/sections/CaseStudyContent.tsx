import Image from "next/image";
import styles from "./CaseStudyContent.module.css";
import { Reveal } from "../motion/Reveal";
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";
import type { Project } from "@/content/projects";

/**
 * Corps de l'étude de cas (doc 14-D.3) : chaque bloc n'existe QUE si sa
 * donnée est présente dans content/projects.ts — aucune section vide,
 * aucun placeholder fabriqué. Le trait jaune devant chaque label reprend
 * le motif éclair (doc 06 : "trait, séparateur").
 */
export function CaseStudyContent({ project }: { project: Project }) {
  const hasAnyBlock =
    project.context ||
    project.solution ||
    (project.features && project.features.length > 0) ||
    project.artDirection ||
    (project.tech && project.tech.length > 0) ||
    (project.gallery && project.gallery.length > 0) ||
    project.results.length > 0 ||
    project.url;

  if (!hasAnyBlock) return null;

  return (
    <section className={styles.content}>
      <div className="dc-container">
        <div className={styles.blocks}>
          {project.context && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Contexte & besoin</p>
              <p className={styles.blockText}>{project.context}</p>
            </Reveal>
          )}

          {project.solution && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Solution</p>
              <p className={styles.blockText}>{project.solution}</p>
            </Reveal>
          )}

          {project.features && project.features.length > 0 && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Fonctionnalités</p>
              <div className={styles.pillList}>
                {project.features.map((feature) => (
                  <Tag key={feature}>{feature}</Tag>
                ))}
              </div>
            </Reveal>
          )}

          {project.artDirection && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Direction artistique</p>
              <p className={styles.blockText}>{project.artDirection}</p>
            </Reveal>
          )}

          {project.tech && project.tech.length > 0 && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Technologies</p>
              <div className={styles.pillList}>
                {project.tech.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </Reveal>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Interfaces desktop & mobile</p>
              <div className={styles.gallery}>
                {project.gallery.map((image, i) => (
                  <div key={i} className={styles.galleryImageWrap}>
                    <Image
                      src={image}
                      alt={`Interface supplémentaire du projet ${project.name}`}
                      className={styles.galleryImage}
                      sizes="(min-width: 1024px) 380px, 90vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {project.results.length > 0 && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Résultats</p>
              <ul className={styles.resultsList}>
                {project.results.map((result) => (
                  <li key={result} className={styles.blockText}>
                    {result}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {project.url && (
            <Reveal className={styles.block}>
              <p className={styles.blockLabel}>Le site</p>
              <Button href={project.url} variant="secondary" target="_blank" rel="noopener">
                Visiter le site ↗
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
