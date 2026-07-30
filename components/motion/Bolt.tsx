"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

// Même tracé que l'éclair déjà utilisé dans le footer du site actuel
// (legacy-static/frontend/*.html, class="footer-spark") — signature
// DamCompany existante, reprise telle quelle plutôt que réinventée.
const BOLT_PATH = "M13 2 3 14h7l-1 8 10-12h-7l1-8z";

type BoltVariant = "trace" | "pulse" | "spark";

type BoltProps = {
  variant?: BoltVariant;
  className?: string;
  /** Déclenche le tracé (variant="trace") — ex: fin de chargement du loader. */
  active?: boolean;
  onTraceComplete?: () => void;
};

/**
 * Motif signature DamCompany : l'éclair jaune animé, fil conducteur du motion
 * design (doc 06/07/13-G). Un seul composant centralise les 3 usages :
 * - "trace" : se dessine (stroke-dashoffset) puis se remplit — loader.
 * - "pulse" : glow doux, en boucle, ambiance hero.
 * - "spark" : flash bref au hover/focus — micro-interactions.
 * Toujours transform/opacity uniquement. Neutralisé si reduced-motion.
 */
export function Bolt({ variant = "pulse", className, active = true, onTraceComplete }: BoltProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    if (reducedMotion) {
      gsap.set(path, { opacity: 1, strokeDashoffset: 0, fillOpacity: variant === "trace" ? 1 : 0.9 });
      if (variant === "trace") onTraceComplete?.();
      return;
    }

    const length = path.getTotalLength();
    const ctx = gsap.context(() => {
      if (variant === "trace") {
        if (!active) return;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0, opacity: 1 });
        const tl = gsap.timeline({ onComplete: onTraceComplete });
        tl.to(path, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }).to(
          path,
          { fillOpacity: 1, duration: 0.25, ease: "power1.out" },
          "-=0.1"
        );
      } else if (variant === "pulse") {
        gsap.set(path, { fillOpacity: 0.85, strokeDashoffset: 0 });
        gsap.to(path, {
          fillOpacity: 0.55,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      } else if (variant === "spark") {
        // Statique : la visibilité/l'échelle au hover sont pilotées en CSS
        // par le composant appelant (transform/opacity uniquement).
        gsap.set(path, { fillOpacity: 1, strokeDashoffset: 0 });
      }
    }, path);

    return () => ctx.revert();
  }, [variant, active, reducedMotion, onTraceComplete]);

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        ref={pathRef}
        d={BOLT_PATH}
        fill="var(--dc-accent)"
        stroke="var(--dc-accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
