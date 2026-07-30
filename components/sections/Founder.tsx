import styles from "./Founder.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../motion/Reveal";

/**
 * Fondateur / équipe (doc 05 storyboard #10). Deux images existent dans
 * legacy-static (Damien-Portfolio.png, Sandrine-Portfolio.png) mais leur
 * usage est marqué "à confirmer" par le doc 09 — rien ne garantit qu'il
 * s'agit de portraits utilisables. Plutôt que de risquer un mauvais usage
 * d'une photo, un bloc neutre + note explicite est affiché (doc J/D.7).
 */
export function Founder() {
  return (
    <section id="equipe" className={styles.founder}>
      <div className={`dc-container ${styles.grid}`}>
        <Reveal>
          <div className={styles.portraitPlaceholder}>
            [À_FOURNIR] Portrait de l’équipe
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Équipe</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className={styles.title}>Les personnes derrière DamCompany</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={styles.text}>
              Présentation de l’équipe et de sa vision à venir — portrait, parcours et
              citation seront ajoutés dès que les éléments seront fournis.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
