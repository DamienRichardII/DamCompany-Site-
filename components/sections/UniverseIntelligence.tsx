import styles from "./UniverseIntelligence.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { Tag } from "../ui/Tag";
import { Card } from "../ui/Card";
import { Reveal } from "../motion/Reveal";
import { Bolt } from "../motion/Bolt";
import { SERVICES } from "@/content/services";
import { PUBLISHED_PROJECTS } from "@/content/projects";

const intelligence = SERVICES.find((service) => service.id === "intelligence")!;
const intelligenceProjects = PUBLISHED_PROJECTS.filter(
  (project) => project.universe === "intelligence"
).slice(0, 3);

/**
 * Univers INTELLIGENCE (doc 05 storyboard #6) — registre cinématique
 * sombre. Le dégradé crème → noir en haut de section porte la transition
 * narrative depuis l'univers BUILD (doc 02 : "un éclair parcourt/relie
 * les sections... transition entre les registres clair et sombre").
 */
export function UniverseIntelligence() {
  return (
    <section id="intelligence" className={styles.universe}>
      <Bolt variant="pulse" className={styles.signal} />

      <div className="dc-container">
        <div className={styles.header}>
          <Reveal>
            <Eyebrow>Univers 02</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className={styles.title}>{intelligence.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={styles.tagline}>{intelligence.tagline}</p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className={styles.items}>
            {intelligence.items.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </Reveal>

        {intelligenceProjects.length > 0 && (
          <div className={styles.previews}>
            {intelligenceProjects.map((project) => (
              <Reveal key={project.slug}>
                <Card project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
