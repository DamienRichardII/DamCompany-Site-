"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import styles from "./MobileNav.module.css";
import { NAV_ITEMS } from "@/lib/nav";
import { useReducedMotion } from "../motion/useReducedMotion";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu plein écran (doc 02/07) : overlay + stagger d'entrée, focus-trap,
 * fermeture au clic lien / Échap / bouton fermer. Ouverture/fermeture
 * fonctionnent sans animation si reduced-motion (doc 12).
 */
export function MobileNav({ open, onClose, returnFocusRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const returnFocusEl = returnFocusRef.current;
    closeButtonRef.current?.focus();

    if (!reducedMotion && panelRef.current) {
      const links = panelRef.current.querySelectorAll(`.${styles.link}`);
      gsap.fromTo(
        panelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power1.out" }
      );
      gsap.fromTo(
        links,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, delay: 0.1, ease: "power3.out" }
      );
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusEl?.focus();
    };
  }, [open, reducedMotion, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      id="dc-mobile-nav"
      ref={panelRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
    >
      <div className={styles.topRow}>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          ×
        </button>
      </div>

      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.link} onClick={onClose}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
