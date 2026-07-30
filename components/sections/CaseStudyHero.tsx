import Image from "next/image";
import Link from "next/link";
import styles from "./CaseStudyHero.module.css";
import { Reveal } from "../motion/Reveal";
import type { Project } from "@/content/projects";

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className={styles.hero}>
      <div className="dc-container">
        <Link href="/realisations" className={styles.backLink}>
          ← Toutes les réalisations
        </Link>

        <Reveal>
          <div className={styles.eyebrowRow}>
            <span>{project.sector}</span>
            {project.year && <span>· {project.year}</span>}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className={styles.title}>{project.name}</h1>
        </Reveal>

        <Reveal delay={0.12}>
          <div className={styles.coverWrap}>
            <Image
              src={project.cover}
              alt={`Interface principale du projet ${project.name}`}
              className={styles.cover}
              sizes="(min-width: 1240px) 1200px, 92vw"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
