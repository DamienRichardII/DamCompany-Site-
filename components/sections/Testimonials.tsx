import styles from "./Testimonials.module.css";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../motion/Reveal";

/**
 * Témoignages / références (doc 05 storyboard #11). Aucun témoignage ni
 * logo client réel n'a été fourni : placeholder explicite, pas de faux
 * avis ni logo fabriqué (doc D.8/J).
 */
export function Testimonials() {
  return (
    <section id="references" className={styles.testimonials}>
      <div className={`dc-container ${styles.inner}`}>
        <Reveal>
          <Eyebrow>Témoignages</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className={styles.title}>[À_FOURNIR] Témoignages clients</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className={styles.text}>
            Cette section accueillera de vrais témoignages et logos clients dès qu’ils
            seront fournis et autorisés — aucun avis ni logo n’est affiché par défaut.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
