"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Loader.module.css";
import { Bolt } from "../motion/Bolt";
import { useReducedMotion } from "../motion/useReducedMotion";

/**
 * Loader de marque : l'éclair se trace puis "décharge" dans la page pour
 * révéler le hero (doc 05/13-G). ≤ 2s, non bloquant : si le JS échoue, le
 * filet CSS (Loader.module.css) retire l'overlay de toute façon.
 */
export function Loader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const dischargeAndHide = () => {
    const overlay = overlayRef.current;
    if (!overlay) {
      setVisible(false);
      return;
    }
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      delay: 0.15,
      ease: "power2.out",
      onComplete: () => setVisible(false),
    });
  };

  useEffect(() => {
    if (!reducedMotion) return;
    const timer = window.setTimeout(() => setVisible(false), 200);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className={styles.loader} role="status" aria-label="Chargement de DamCompany">
      {!reducedMotion && (
        <Bolt variant="trace" className={styles.bolt} onTraceComplete={dischargeAndHide} />
      )}
    </div>
  );
}
