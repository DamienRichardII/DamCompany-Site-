"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./StatCounter.module.css";
import { useReducedMotion } from "../motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type StatCounterProps = {
  /** Valeur vérifiée — si absente, aucun chiffre n'est fabriqué (doc J) : le placeholder est affiché tel quel, sans animation. */
  value?: number;
  suffix?: string;
  label: string;
  placeholder?: string;
};

export function StatCounter({ value, suffix = "", label, placeholder = "[À_VÉRIFIER]" }: StatCounterProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = valueRef.current;
    if (!el || value === undefined) return;

    if (reducedMotion) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    const counter = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: value,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.n)}${suffix}`;
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, reducedMotion]);

  return (
    <div className={styles.stat}>
      <span
        ref={valueRef}
        className={value === undefined ? `${styles.value} ${styles.placeholder}` : styles.value}
      >
        {value === undefined ? placeholder : `0${suffix}`}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
