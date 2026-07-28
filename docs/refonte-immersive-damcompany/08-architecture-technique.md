# 08 — Architecture technique

## Stack existante (constatée)

Site **statique vanilla** : 9 pages HTML, `css/style.css`, `js/main.js`, backend Express optionnel (`/api/contact`). Aucun framework front.

## Stack cible (décision validée)

**Next.js (App Router) + React + TypeScript**, avec :

```text
Framework   Next.js 14+ (App Router, RSC)
Langage     TypeScript (strict)
Style       CSS Modules + variables globales (tokens)  [Tailwind optionnel, non requis]
Scroll      Lenis
Animation   GSAP + ScrollTrigger  (Framer Motion : micro-interactions ponctuelles)
3D (option) Three.js / React Three Fiber — P2, lazy + dégradable
CMS         Sanity OU Supabase pour les études de cas — P4 (données locales JSON d'abord)
Images      next/image (WebP/AVIF, lazy, responsive)
Fonts       next/font (self-host display + texte)
Contact     Route Handler /app/api/contact + service email (Resend) — reprend la logique existante
Deploy      Vercel
CI          GitHub (le dépôt existe déjà)
```

**Justification (règle « ne pas changer de stack sans raison ») :** l'objectif — un site immersif orchestré au scroll, avec transitions de page, études de cas dynamiques et 3D optionnelle — dépasse ce qu'un site statique vanilla maintient proprement. Next.js apporte routing, RSC, `next/image`, `next/font`, code-splitting et un écosystème motion mature. Le backend Express actuel est **remplacé** par un Route Handler équivalent (pas de perte de fonctionnalité).

## Migration = évolution progressive (pas de big bang)

- Nouvelle base Next.js créée dans une **branche dédiée** (`feat/refonte-immersive`).
- Le site statique actuel **reste intact** sur `main` jusqu'à validation.
- Reprise progressive du contenu réel (textes, projets, assets) ; on ne jette rien sans analyse.
- Redirections **301** des anciennes URLs (`sites-web.html`, etc.) vers la nouvelle arborescence pour préserver le SEO.

## Arborescence de fichiers cible (proposition)

```text
/ (racine dépôt)
├─ app/
│  ├─ layout.tsx                # fonts, providers (Lenis/GSAP), <head> SEO
│  ├─ page.tsx                  # accueil (sections en RSC + client islands)
│  ├─ realisations/
│  │   ├─ page.tsx              # galerie
│  │   └─ [slug]/page.tsx       # étude de cas
│  ├─ services/
│  │   ├─ page.tsx
│  │   ├─ build/page.tsx
│  │   └─ intelligence/page.tsx
│  ├─ a-propos/page.tsx
│  ├─ contact/page.tsx
│  ├─ api/contact/route.ts      # remplace backend/server.js
│  ├─ sitemap.ts  robots.ts
│  └─ not-found.tsx
├─ components/
│  ├─ layout/ (Header, Footer, MobileNav, Loader)
│  ├─ motion/ (LenisProvider, Reveal, MagneticButton, useReducedMotion)
│  ├─ sections/ (Hero, Chain, UniverseBuild, UniverseIntelligence, Gallery, Stats, Process, Founder, Testimonials, CtaBand)
│  └─ ui/ (Button, Card, Tag, Eyebrow)
├─ content/
│  ├─ projects.ts               # données projets (typées) — source unique
│  └─ services.ts
├─ lib/ (seo.ts, gsap.ts, format.ts)
├─ styles/ (tokens.css, globals.css, *.module.css)
├─ public/
│  ├─ media/projects/*.webp
│  ├─ brand/ (logo.svg, favicon.svg, og.webp)
│  └─ 3d/ (*.glb — option)
├─ docs/refonte-immersive-damcompany/   # ce dossier
└─ (config) next.config.js, tsconfig.json, .env.example
```

## Données projets (source unique, typée)

```ts
// content/projects.ts
export type Project = {
  slug: string;
  name: string;
  url?: string;               // lien réel uniquement
  sector: string;            // secteur
  year?: number;
  universe: 'build' | 'intelligence';
  cover: string;             // /media/projects/xxx.webp
  gallery?: string[];
  tech?: string[];
  summary?: string;          // besoin / solution
  results?: string[];        // UNIQUEMENT si vérifiés, sinon []
  published: boolean;
};
```

Projets avec assets présents (réutilisables) : UBO-DROP, MA1, MA1 IA, Reset SMP, Africa2kball, Nad Motivation, I Can Play, One One Arena, KingBrel, Divan Grill, Peace of Mind Signature, UBODROP App.
Projets **sans asset** (à produire) : Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100 → `published: false` tant que l'asset manque.

## Conventions

- TypeScript **strict**, pas de `any` non justifié, pas de `@ts-ignore` masquant.
- Composants **réutilisables**, un composant = un rôle ; sections découplées du data.
- Server Components par défaut ; `'use client'` seulement pour l'interactif (motion, form).
- SEO via `generateMetadata` par route ; `og:image` = vraie image WebP.
- Accessibilité : landmarks, `focus-visible`, `prefers-reduced-motion`, navigation clavier du menu (focus-trap).
- Aucune dépendance ajoutée sans justification (voir liste ci-dessus = périmètre autorisé).

## Contact (reprise sans régression)

`app/api/contact/route.ts` reproduit la validation existante (`prenom, nom, email, service, message`) et renvoie `{ success, message }`. Envoi email réel via Resend en option (clé en `.env`). Le formulaire ne doit jamais être présenté comme fonctionnel s'il ne l'est pas.
