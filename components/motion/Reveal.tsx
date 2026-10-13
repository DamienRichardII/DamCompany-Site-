"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Révélation de titre/bloc au scroll : opacity + translateY courts (doc 07).
 * GPU-only (transform/opacity). Coupé en un fondu 120ms si reduced-motion —
 * le contenu reste visible et compréhensible dans tous les cas.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12 });
        return;
      }

      const distance = window.innerWidth < 768 ? 10 : 20;
      gsap.fromTo(
        el,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
