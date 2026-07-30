"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Chain.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { useReducedMotion } from "../motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  "Idée",
  "Stratégie",
  "Design",
  "Développement",
  "Intelligence",
  "Automatisation",
  "Déploiement",
  "Croissance",
];

/**
 * Chaîne de fabrication (doc 05 storyboard #4) : section pin au scroll,
 * un trait-éclair (transform: scaleY, pas de path SVG animé) relie les
 * étapes qui s'activent progressivement. En reduced-motion ou mobile
 * étroit, pas de pin : liste ordonnée normale, toutes les étapes visibles
 * (le sens n'est jamais porté uniquement par l'animation, doc 07/12).
 */
export function Chain() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const fill = fillRef.current;
    const steps = stepRefs.current.filter((el): el is HTMLLIElement => Boolean(el));

    if (!section || !fill || steps.length === 0) return;

    if (reducedMotion || window.innerWidth < 768) {
      steps.forEach((step) => step.classList.add(styles.active));
      return;
    }

    gsap.set(fill, { scaleY: 0 });

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${steps.length * 380}`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          gsap.set(fill, { scaleY: self.progress });
          const activeIndex = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          steps.forEach((step, i) => step.classList.toggle(styles.active, i <= activeIndex));
        },
      });

      // Les images (next/image, chargées en lazy plus bas dans la page)
      // peuvent finir de se mettre en page après ce calcul initial et
      // décaler la position réelle de la section : un refresh différé
      // (double rAF + window "load") recale le pin sur le layout final.
      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(() => requestAnimationFrame(refresh));
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        trigger.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="chaine" ref={sectionRef} className={styles.chain}>
      <div className={`dc-container ${styles.inner}`}>
        <div className={styles.header}>
          <Eyebrow>La chaîne de fabrication</Eyebrow>
          <h2 className={styles.title}>Une idée devient produit intelligent</h2>
        </div>

        <div className={styles.track}>
          <div className={styles.lineBase} aria-hidden="true" />
          <div ref={fillRef} className={styles.lineFill} aria-hidden="true" />
          <ol className={styles.steps}>
            {STEPS.map((label, i) => (
              <li
                key={label}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={styles.step}
              >
                <span className={styles.stepIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.stepLabel}>{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
