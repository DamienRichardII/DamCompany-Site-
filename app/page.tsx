import { Loader } from "@/components/layout/Loader";
import { Hero } from "@/components/sections/Hero";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Loader />
      <Hero />

      {/* Respiration — section "Vision" (doc 05, storyboard #3) */}
      <section id="vision" className={styles.vision}>
        <div className={`dc-container ${styles.visionInner}`}>
          <Reveal>
            <p className={styles.visionText}>
              Chaque projet est une chaîne : une idée devient stratégie, la stratégie
              devient design, le design devient produit — et le produit devient
              intelligent.
            </p>
          </Reveal>
        </div>
      </section>

      {/*
        Sections suivantes (doc 05, storyboard #4 à #13) — hors périmètre de
        cette exécution (Phase 0→1→2, doc 13-E) :
        - La chaîne (8 étapes Idée → Croissance)
        - Univers BUILD / INTELLIGENCE
        - Galerie de réalisations / études de cas
        - Chiffres clés, Processus, Fondateur, Témoignages
        - CTA de conversion
        À construire en Phase 3 (doc 10-roadmap-execution.md).
      */}
    </>
  );
}
