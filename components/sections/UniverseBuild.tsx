import styles from "./UniverseBuild.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { Tag } from "../ui/Tag";
import { Card } from "../ui/Card";
import { Reveal } from "../motion/Reveal";
import { SERVICES } from "@/content/services";
import { PUBLISHED_PROJECTS } from "@/content/projects";

const build = SERVICES.find((service) => service.id === "build")!;
const buildProjects = PUBLISHED_PROJECTS.filter((project) => project.universe === "build").slice(0, 3);

export function UniverseBuild() {
  return (
    <section id="build" className={styles.universe}>
      <div className="dc-container">
        <div className={styles.header}>
          <Reveal>
            <Eyebrow>Univers 01</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className={styles.title}>{build.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={styles.tagline}>{build.tagline}</p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className={styles.items}>
            {build.items.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </Reveal>

        {buildProjects.length > 0 && (
          <div className={styles.previews}>
            {buildProjects.map((project) => (
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
