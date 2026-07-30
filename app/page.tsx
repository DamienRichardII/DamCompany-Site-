import { Loader } from "@/components/layout/Loader";
import { Hero } from "@/components/sections/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { Chain } from "@/components/sections/Chain";
import { UniverseBuild } from "@/components/sections/UniverseBuild";
import { UniverseIntelligence } from "@/components/sections/UniverseIntelligence";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { Stats } from "@/components/sections/Stats";
import { Process } from "@/components/sections/Process";
import { Founder } from "@/components/sections/Founder";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
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

      {/* Phase 3 — récit "FROM IDEA TO INTELLIGENT PRODUCT" (doc 05, storyboard #4 à #12) */}
      <Chain />
      <UniverseBuild />
      <UniverseIntelligence />
      <GalleryPreview />
      <Stats />
      <Process />
      <Founder />
      <Testimonials />
      <CtaBand />

      {/*
        Études de cas détaillées (/realisations/[slug]) — Phase 4
        (doc 10-roadmap-execution.md). 3D/WebGL hero — Phase 5.
      */}
    </>
  );
}
