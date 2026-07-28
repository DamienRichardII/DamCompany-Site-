"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Hero.module.css";
import { Reveal } from "../motion/Reveal";
import { Bolt } from "../motion/Bolt";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { useReducedMotion } from "../motion/useReducedMotion";
import shotUbodrop from "@/legacy-static/frontend/assets/Ubodrop-site.png";
import shotMa1 from "@/legacy-static/frontend/assets/MA1-site.png";

export function Hero() {
  const mockupsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = mockupsRef.current;
    if (!container || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cards = container.querySelectorAll<HTMLElement>(`.${styles.mockupCard}`);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const relY = (event.clientY - rect.top - rect.height / 2) / rect.height;

      cards.forEach((card, index) => {
        const intensity = index === 0 ? 10 : 16;
        gsap.to(card, { x: relX * intensity, y: relY * intensity, duration: 0.6, ease: "power3.out" });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  return (
    <section className={styles.hero} id="hero">
      <Bolt variant="pulse" className={styles.boltAmbient} />

      <div className={`dc-container ${styles.grid}`}>
        <div>
          <Reveal>
            <div className={styles.eyebrowRow}>
              <Eyebrow>Agence digitale — Build &amp; Intelligence</Eyebrow>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className={styles.title}>
              FROM IDEA TO <span className={styles.titleAccent}>INTELLIGENT PRODUCT</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className={styles.subtitle}>
              DamCompany transforme vos idées en produits digitaux intelligents : sites,
              applications, IA, data et automatisation — une seule chaîne, de la stratégie
              au déploiement.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className={styles.ctas}>
              <Button href="/contact" variant="primary">
                Démarrer un projet
              </Button>
              <Button href="/realisations" variant="secondary">
                Voir nos réalisations
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div ref={mockupsRef} className={styles.mockups}>
            <div className={styles.mockupCard}>
              <Image
                src={shotUbodrop}
                alt="Interface d'un projet livré par DamCompany"
                className={styles.mockupImage}
                sizes="(min-width: 920px) 320px, 45vw"
                priority
              />
            </div>
            <div className={styles.mockupCard}>
              <Image
                src={shotMa1}
                alt="Interface d'un second projet livré par DamCompany"
                className={styles.mockupImage}
                sizes="(min-width: 920px) 320px, 45vw"
              />
            </div>
            <p className={styles.mockupsCaption}>
              Aperçus d’interfaces livrées — captures en attente de mockups homogènes (doc 09).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
