import Link from "next/link";
import styles from "./Footer.module.css";
import { Bolt } from "../motion/Bolt";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Footer minimal (Phase 2). Coordonnées identiques aux placeholders du site
 * actuel — non vérifiées, à remplacer (doc 09/J).
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`dc-container ${styles.inner}`}>
        <div className={styles.top}>
          <Bolt variant="pulse" className={styles.bolt} />
          <nav aria-label="Navigation du pied de page">
            <ul className={styles.nav}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} DamCompany. Tous droits réservés.</span>
          <span>[À_VÉRIFIER] +33 6 00 00 00 00 · contact@damcompany.com</span>
        </div>
      </div>
    </footer>
  );
}
