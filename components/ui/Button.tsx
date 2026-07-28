"use client";

import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";
import styles from "./Button.module.css";
import { useReducedMotion } from "../motion/useReducedMotion";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

/**
 * CTA avec micro-interaction "bouton magnétique" (doc 07) : léger suivi du
 * curseur au hover, desktop uniquement, coupé si reduced-motion.
 */
export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  const isFinePointer =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !isFinePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, { x: x * 0.25, y: y * 0.25, duration: 0.24, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}
