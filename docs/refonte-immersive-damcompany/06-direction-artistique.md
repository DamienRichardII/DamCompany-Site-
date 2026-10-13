# 06 — Direction artistique & design tokens

Évolution de l'identité existante (on **conserve** l'ADN crème/noir/jaune) + ajout d'un registre **cinématique sombre** et d'une typographie display.

## Couleurs (tokens)

```css
/* Base — reprise de l'existant */
--dc-cream:      #faf7ef;   /* fond clair */
--dc-cream-2:    #fffdf8;
--dc-black:      #141414;   /* noir de marque */
--dc-black-deep: #0d0d0d;   /* fond cinématique sombre */
--dc-yellow:     #ffc83d;   /* accent / signal éclair */
--dc-yellow-2:   #ffd873;   /* survol / halo */
--dc-text:       #1c1c1c;
--dc-text-muted: #6b6b6b;
--dc-text-invert:#f4f4f4;   /* texte sur sombre */
--dc-border:     #ece7d8;

/* Sémantique */
--dc-bg:         var(--dc-cream);
--dc-bg-cine:    var(--dc-black-deep);  /* sections immersives */
--dc-accent:     var(--dc-yellow);
```

**Règle de contraste :** viser WCAG AA (≥ 4.5:1 texte courant). Le jaune ne sert jamais de couleur de texte sur fond clair ; il sert d'accent, de trait, de halo.

## Typographie

- **Display (nouvelle) :** une famille forte pour les titres monumentaux — recommandation : **Clash Display**, **Space Grotesk** ou **Satoshi** (self-host via `next/font`, licences à vérifier). Fallback système.
- **Texte :** **Poppins** conservé (cohérence avec l'existant) ou **Inter** pour les longs textes.
- **Échelle (clamp, fluide) :**

```css
--fs-hero:   clamp(2.75rem, 8vw, 8rem);   /* titre monumental */
--fs-h1:     clamp(2rem, 4.5vw, 4rem);
--fs-h2:     clamp(1.5rem, 3vw, 2.5rem);
--fs-body:   clamp(1rem, 1.1vw, 1.125rem);
--fs-eyebrow:.8125rem; /* surtitres, letterspacing +.08em, uppercase */
```

## Grille & espacements

- **Grille :** 12 colonnes, gouttière 24px, `max-width` conteneur 1240–1440px, marges latérales fluides. Compositions **asymétriques** autorisées (décalages, débords maîtrisés sans scroll horizontal).
- **Espacements (échelle 4px) :** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Rythme vertical :** sections « intenses » (100vh possibles) alternées avec respirations plus courtes.

## Rayons, ombres, surfaces

```css
--r-sm:12px; --r:18px; --r-lg:26px; --r-xl:36px;
--sh-sm:0 4px 14px rgba(20,20,20,.06);
--sh:   0 14px 40px rgba(20,20,20,.08);
--sh-lg:0 24px 60px rgba(20,20,20,.12);
--sh-cine:0 30px 80px rgba(0,0,0,.5); /* cartes sur fond sombre */
```

## Iconographie & motifs

- **Éclair** = motif signature (trait, séparateur, puce, halo). Style trait 2px, cohérent.
- Icônes ligne (style lucide) monochromes, accent jaune ponctuel.
- Légendes projets standardisées : `Client · Secteur · Année · Techno`.

## États d'interaction (obligatoires)

- **hover / focus-visible / active** définis pour tous les éléments cliquables ; `:focus-visible` toujours visible (anneau 2px accent).
- Aucune information ni action essentielle uniquement au **hover** (fournir équivalent focus/clic).
- Curseur personnalisé **facultatif** et non bloquant (desktop only, dégradable).

## Deux registres visuels

| Registre | Usage | Fond | Texte | Accent |
|---|---|---|---|---|
| **Clair** | header, services, contact | crème | noir | jaune |
| **Cinématique** | hero moments, univers, galerie | noir profond | crème | jaune + halo |

La transition clair→sombre est un **moment narratif** (passage BUILD → INTELLIGENCE).

## Responsive / mobile-first

- Concevoir d'abord à **320px** ; titres monumentaux → `clamp` ; jamais de débordement horizontal.
- Cartes flottantes / superpositions desktop → empilement propre en mobile.
- Respecter `prefers-reduced-motion` et `prefers-color-scheme` si un dark mode est proposé.
