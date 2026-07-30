import styles from "./CtaBand.module.css";
import { Button } from "../ui/Button";
import { Bolt } from "../motion/Bolt";
import { Reveal } from "../motion/Reveal";

/**
 * CTA de conversion (doc 05 storyboard #12). Coordonnées identiques aux
 * placeholders déjà utilisés dans le Footer — non inventées, marquées
 * [À_VÉRIFIER] (doc J). Pas de lien RDV/WhatsApp fabriqué tant que les
 * vrais liens ne sont pas fournis.
 */
export function CtaBand() {
  return (
    <section id="cta" className={styles.cta}>
      <Bolt variant="pulse" className={styles.bolt} />
      <div className={`dc-container ${styles.inner}`}>
        <Reveal>
          <h2 className={styles.title}>Parlons de votre projet</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Button href="/contact" variant="primary">
            Démarrer un projet
          </Button>
        </Reveal>
        <Reveal delay={0.14}>
          <p className={styles.channels}>
            [À_VÉRIFIER] +33 6 00 00 00 00 · contact@damcompany.com · RDV et WhatsApp à venir
          </p>
        </Reveal>
      </div>
    </section>
  );
}
