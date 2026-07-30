import Link from "next/link";
import styles from "./FilterTabs.module.css";
import type { Universe } from "@/content/projects";

type FilterTabsProps = {
  active?: Universe;
};

const TABS: { label: string; value?: Universe }[] = [
  { label: "Tous", value: undefined },
  { label: "Build", value: "build" },
  { label: "Intelligence", value: "intelligence" },
];

/**
 * Filtre par univers implémenté en liens (paramètre `?universe=`), pas en
 * état client : chaque état est une vraie URL, navigable au clavier et
 * fonctionnelle sans JavaScript — la galerie affiche tout par défaut
 * (doc 14-D.2/G).
 */
export function FilterTabs({ active }: FilterTabsProps) {
  return (
    <nav aria-label="Filtrer les réalisations par univers" className={styles.tabs}>
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        const href = tab.value ? `/realisations?universe=${tab.value}` : "/realisations";
        return (
          <Link
            key={tab.label}
            href={href}
            className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
