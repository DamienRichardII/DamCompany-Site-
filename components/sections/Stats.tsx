import styles from "./Stats.module.css";
import { StatCounter } from "../ui/StatCounter";
import { Reveal } from "../motion/Reveal";

/**
 * Chiffres clés (doc 05 storyboard #8). Aucune valeur vérifiée n'a été
 * fournie (doc J) : le composant StatCounter est fonctionnel (compte-up
 * GSAP prêt pour de vrais chiffres) mais affiche un placeholder explicite
 * plutôt qu'un nombre fabriqué.
 */
const STATS = [
  { label: "Projets livrés" },
  { label: "Secteurs accompagnés" },
  { label: "Années d'expérience" },
  { label: "Satisfaction client" },
];

export function Stats() {
  return (
    <section id="chiffres" className={styles.stats}>
      <div className={`dc-container ${styles.grid}`}>
        {STATS.map((stat) => (
          <Reveal key={stat.label}>
            <StatCounter label={stat.label} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
