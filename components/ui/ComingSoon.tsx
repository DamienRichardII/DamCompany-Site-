import styles from "./ComingSoon.module.css";
import { Eyebrow } from "./Eyebrow";
import { Button } from "./Button";

/**
 * Page de jalon pour les routes de l'arborescence cible (doc 05) pas encore
 * construites dans cette exécution (Phase 2 = loader/header/hero uniquement,
 * doc 13-E). Évite tout lien mort dans le header/footer sans fabriquer de
 * contenu — la section réelle arrive en Phase 3.
 */
export function ComingSoon({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>
          Cette section arrive dans la prochaine phase de la refonte. En attendant,
          retournez à l’accueil pour découvrir le nouveau hero.
        </p>
        <Button href="/" variant="secondary">
          Retour à l’accueil
        </Button>
      </div>
    </div>
  );
}
