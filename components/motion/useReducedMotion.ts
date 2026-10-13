"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// Rendu serveur : on ne connaît pas la préférence du client, on part de
// `false` (comme le contenu réel, jamais porté uniquement par l'animation).
function getServerSnapshot() {
  return false;
}

/**
 * Source unique de vérité pour `prefers-reduced-motion` (doc 07).
 * `useSyncExternalStore` évite tout `setState` synchrone dans un effet et
 * reste cohérent entre le rendu serveur et l'hydratation client.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
