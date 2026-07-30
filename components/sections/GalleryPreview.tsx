import styles from "./GalleryPreview.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Reveal } from "../motion/Reveal";
import { PUBLISHED_PROJECTS } from "@/content/projects";

const PREVIEW_PROJECTS = PUBLISHED_PROJECTS.slice(0, 6);

/**
 * Aperçu de la galerie (doc 05 storyboard #7 / doc 13-D.4). Études de cas
 * détaillées = Phase 4 ; ici, uniquement un aperçu + renvoi vers /realisations.
 */
export function GalleryPreview() {
  return (
    <section id="realisations-preview" className={styles.gallery}>
      <div className="dc-container">
        <div className={styles.header}>
          <div>
            <Reveal>
              <Eyebrow>Réalisations</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className={styles.title}>Des idées devenues produits</h2>
            </Reveal>
          </div>
          <Button href="/realisations" variant="secondary">
            Voir toutes nos réalisations
          </Button>
        </div>

        <div className={styles.grid}>
          {PREVIEW_PROJECTS.map((project) => (
            <Reveal key={project.slug}>
              <Card project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
