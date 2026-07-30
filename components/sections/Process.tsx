"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Process.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../motion/Reveal";
import { useReducedMotion } from "../motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "Écoute & cadrage", text: "Comprendre l'objectif, le contexte et les contraintes du projet." },
  { title: "Stratégie & design", text: "Définir l'expérience et l'identité visuelle du produit." },
  { title: "Développement", text: "Construire une base technique solide, testée et évolutive." },
  {
    title: "Intelligence & automatisation",
    text: "Intégrer IA, data et automatisation là où elles créent de la valeur.",
  },
  { title: "Déploiement & suivi", text: "Mettre en production et accompagner la croissance du produit." },
];

/**
 * Reveal échelonné géré en interne (pas via <Reveal>, qui rend un <div> —
 * invalide comme enfant direct d'un <ol>). Visible par défaut en CSS : le
 * contenu reste lisible même si ce script échoue.
 */
export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list || reducedMotion) return;

    const items = Array.from(list.children) as HTMLElement[];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: list, start: "top 85%", once: true },
        }
      );
    }, list);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="process" className={styles.process}>
      <div className="dc-container">
        <div className={styles.header}>
          <Reveal>
            <Eyebrow>Méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className={styles.title}>Comment nous travaillons</h2>
          </Reveal>
        </div>

        <ol ref={listRef} className={styles.list}>
          {STEPS.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
