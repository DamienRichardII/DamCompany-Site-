# 10 — Roadmap d'exécution

Progressive, testée à chaque phase. **Ne jamais tout reconstruire d'un coup.**

## Phase 0 — Sauvegarde & diagnostic
- **Objectifs :** point de départ sûr.
- **Actions :** sauvegarder `main` ; créer branche `feat/refonte-immersive` ; audit dépendances ; vérifier build ; relever perfs (Lighthouse) ; captures de référence.
- **Fichiers :** aucun fichier fonctionnel modifié ; ajout `docs/`.
- **Risques :** aucun.
- **Validation :** branche créée, état initial documenté, build actuel OK.

## Phase 1 — Fondations
- **Objectifs :** base technique + design system.
- **Actions :** init Next.js/TS ; `styles/tokens.css` (couleurs, typo, espacements) ; `next/font` ; grille ; `LenisProvider` + setup GSAP ; hook `useReducedMotion` ; structure globale (layout, Header, Footer vides) ; a11y de base.
- **Fichiers :** `app/layout.tsx`, `styles/*`, `components/motion/*`, `components/layout/*`.
- **Dépendances :** next, react, gsap, lenis, (framer-motion).
- **Risques :** sur-configuration → rester minimal.
- **Validation :** build OK, tokens appliqués, scroll fluide, reduced-motion respecté.

## Phase 2 — Prototype immersif (périmètre 1re exécution)
- **Objectifs :** prouver la direction sur le haut de page.
- **Actions :** **Loader + Header + Hero** + première transition/respiration ; version desktop **et** mobile ; `prefers-reduced-motion` ; tests.
- **Fichiers :** `Loader`, `Header`, `MobileNav`, `sections/Hero`, `app/page.tsx` (partiel).
- **Risques :** hero trop lourd → objet 3D en option seulement.
- **Validation :** hero lisible à 320px, CTA visible vite, aucune erreur console, animations désactivables. *(Voir `12-criteres-validation.md`.)*

## Phase 3 — Homepage complète
- **Objectifs :** dérouler le récit.
- **Actions :** sections Vision, Chaîne, BUILD, INTELLIGENCE, Galerie (aperçu), Stats, Process, Fondateur, Témoignages, CTA, Footer.
- **Fichiers :** `components/sections/*`, `content/projects.ts`, `content/services.ts`.
- **Risques :** contenus/chiffres non fournis → placeholders explicites.
- **Validation :** parcours complet cohérent, responsive, perf surveillée.

## Phase 4 — Études de cas
- **Objectifs :** transformer les projets en preuves.
- **Actions :** page galerie `/realisations` + modèle `[slug]` ; données projets ; navigation entre réalisations ; (option) CMS Sanity/Supabase.
- **Fichiers :** `app/realisations/*`, `content/projects.ts`.
- **Risques :** assets manquants → `published:false`.
- **Validation :** au moins 6 études de cas réelles publiées, liens réels, aucun résultat inventé.

## Phase 5 — Expériences avancées (optionnel)
- **Objectifs :** montée en gamme premium.
- **Actions :** objet 3D hero (R3F), galerie horizontale, transitions de page avancées, mockups interactifs.
- **Fichiers :** `components/sections/Hero3D`, `motion/PageTransition`.
- **Risques :** perf/mobile → tout dégradable et lazy.
- **Validation :** site utilisable **sans** WebGL ; pas de régression perf.

## Phase 6 — Optimisation & lancement
- **Objectifs :** qualité production.
- **Actions :** Lighthouse/CWV ; responsive Safari/Chrome/Android ; a11y ; compression images ; lazy loading ; redirections 301 des anciennes URLs ; sitemap/robots ; SEO ; QA finale.
- **Fichiers :** `next.config.js` (redirects), `sitemap.ts`, `robots.ts`.
- **Risques :** régressions SEO → vérifier redirections + metas.
- **Validation :** CWV au vert (objectif), 0 erreur console, 0 scroll horizontal, SEO conservé/amélioré.

## Ordre recommandé de la 1re exécution Claude Code
**Phase 0 → Phase 1 → Phase 2 (loader/header/hero desktop+mobile) → compte rendu.** Puis validation humaine avant Phase 3.
