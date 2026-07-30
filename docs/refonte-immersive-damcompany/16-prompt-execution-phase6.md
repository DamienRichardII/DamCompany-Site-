# 16 — Prompt d'exécution Claude Code — PHASE 6 (Optimisation, SEO, redirections, déploiement)

> À copier dans Claude Code, à la racine du dépôt, une fois les Phases 2→4 validées.
> Périmètre : **qualité production** — performance, accessibilité finale, SEO, redirections 301, QA multi-navigateurs, préparation du déploiement Vercel. NE PAS ajouter de nouvelles sections ni de 3D (Phase 5, séparée). Aucune refonte visuelle.

---

```text
MISSION — REFONTE IMMERSIVE DAMCOMPANY · PHASE 6 (Optimisation & mise en production)

Lis d'abord : docs/refonte-immersive-damcompany/ (06 DA, 07 motion, 08 architecture, 09 assets, 10 roadmap Phase 6, 11 risques, 12 critères) + Damcompany-code-guardrails.md.
Respecte les guardrails : modification chirurgicale, zéro régression visuelle/fonctionnelle, aucune dépendance non justifiée, aucun contenu inventé.

────────────────────────────────────────
A. TON RÔLE
────────────────────────────────────────
Lead developer Next.js/TS, garant performance (Core Web Vitals), accessibilité, SEO et mise en production. Rien n'est « terminé » sans mesure/test.

────────────────────────────────────────
B. ÉTAT RÉEL DU DÉPÔT (constaté — à vérifier toi-même)
────────────────────────────────────────
- Next.js (App Router) + TS à la racine ; ancien site conservé dans /legacy-static/ (NON servi). Branche feat/refonte-immersive.
- Pages : / (homepage complète), /realisations (galerie), /realisations/[slug] (13 études de cas SSG), /services & /a-propos = ComingSoon, /contact.
- content/projects.ts : 13 projets publiés (assets réels) ; 4 en attente d'image (NZ 100%, Amely Paris, Top Hoops, Tibaduiza Elí) — NE PAS les publier sans capture réelle.
- next.config.ts : PAS de redirects (juste turbopack.root). 
- app/sitemap.ts, app/robots.ts : ABSENTS.
- metadataBase : NON défini (d'où le warning build connu).
- lib/seo.ts (buildMetadata) : openGraph.images = "/brand/logo.svg" (placeholder — pas une vraie image de partage).
- Images sources : PNG lourds dans legacy-static/frontend/assets/ (plusieurs > 1 Mo), servis via next/image (donc déjà transcodés WebP/AVIF à la volée) — mais le poids source reste à réduire.
- Dépendances : gsap, lenis, framer-motion. Pas de CMS ni Three.js.
COMMENCE PAR : vérifier next.config.ts, lib/seo.ts, app/layout.tsx, et lancer un `npm run build` de référence (relever le warning metadataBase + tailles de bundles).

────────────────────────────────────────
C. OBJECTIF DE LA PHASE 6
────────────────────────────────────────
Rendre le site prêt pour la production : rapide, accessible, bien référencé, sans perte de SEO par rapport à l'ancien site, et déployable sur Vercel. Aucune modification de la direction artistique ni du contenu.

────────────────────────────────────────
D. PÉRIMÈTRE — TÂCHES (dans cet ordre)
────────────────────────────────────────
1. SEO — MÉTADONNÉES
   • Définir metadataBase dans app/layout.tsx (URL de prod = variable env NEXT_PUBLIC_SITE_URL, fallback "http://localhost:3000"). Corrige le warning.
   • lib/seo.ts : title template ("%s — DamCompany"), description par défaut, openGraph + twitter (summary_large_image), canonical par page.
   • Remplacer l'OG placeholder par une vraie image : public/brand/og.webp (1200×630). Si l'asset n'existe pas encore, générer une image OG simple à partir du logo + fond de marque (SVG→WebP) OU laisser un placeholder documenté [OG_À_PRODUIRE] et le signaler — NE PAS prétendre qu'elle existe.
2. SEO — FICHIERS
   • app/sitemap.ts : routes statiques + toutes les études de cas publiées (PUBLISHED_PROJECTS). 
   • app/robots.ts : autoriser l'indexation, référencer le sitemap.
   • (Optionnel P2) JSON-LD Organization sur la home + CreativeWork/Article sur les études de cas — uniquement avec des données réelles.
3. REDIRECTIONS 301 (next.config.ts → async redirects())
   Mapper les anciennes URLs .html vers la nouvelle arborescence (permanent: true) :
     /index.html            → /
     /sites-web.html        → /services
     /applications.html     → /services
     /ia.html               → /services
     /data.html             → /services
     /automatisation.html   → /services
     /crm.html              → /services
     /consulting.html       → /services
     /contact.html          → /contact
   (Ajuster si /services/build & /services/intelligence existent un jour.)
4. PERFORMANCE / IMAGES
   • Vérifier que TOUTES les images passent par next/image (sizes corrects, priority uniquement sur le LCP, lazy ailleurs, dimensions réservées → 0 CLS).
   • Réduire le poids SOURCE des PNG > 500 Ko (recompression / conversion WebP dans legacy-static ou public) SANS dégrader visuellement — documenter la méthode. Ne pas supprimer les originaux sans copie.
   • Vérifier next.config images (formats AVIF/WebP activés par défaut) ; ajouter un cache-control raisonnable si pertinent.
   • Code-splitting : confirmer que GSAP/Lenis/Framer ne chargent que côté client là où nécessaire ('use client' ciblé). Pas de JS d'animation sur les pages qui n'en ont pas besoin.
5. ACCESSIBILITÉ (finale)
   • Audit clavier complet (header, menu, filtres galerie, formulaire, liens études de cas) ; focus-visible partout (--focus-ring).
   • Contrastes AA (texte courant ≥ 4.5:1) ; le jaune jamais en texte sur clair.
   • prefers-reduced-motion respecté sur toutes les pages (revérifier après ajouts).
   • Landmarks/roles, alt pertinents, hiérarchie de titres correcte (un seul h1 par page).
6. QA MULTI-SUPPORTS
   • 320 → 1920 px : 0 scroll horizontal, 0 débordement, sur home, galerie, étude de cas, contact.
   • Navigateurs : Chrome, Safari (desktop + iOS), Firefox, Android. Signaler tout écart (ex. sticky/pin, backdrop-filter, gap).
   • 0 erreur console sur un parcours complet.
7. DÉPLOIEMENT VERCEL (préparation)
   • Vérifier que `npm run build` passe proprement (0 erreur, warning metadataBase résolu).
   • Créer/mettre à jour .env.example (NEXT_PUBLIC_SITE_URL, + variables contact si Resend branché).
   • Documenter dans docs/.../_journal.md les étapes de déploiement (connexion du repo GitHub à Vercel, variables d'env, domaine). NE PAS déclencher de déploiement ni de paiement : laisser l'action finale à l'utilisateur.

────────────────────────────────────────
E. PLAN DE FICHIERS
────────────────────────────────────────
À CRÉER : app/sitemap.ts, app/robots.ts, public/brand/og.webp (ou placeholder documenté).
À MODIFIER : app/layout.tsx (metadataBase, template), lib/seo.ts (OG/twitter/canonical), next.config.ts (redirects + images si besoin), .env.example, docs/.../_journal.md.
À NE PAS TOUCHER : DA, sections homepage, hero, loader, motion, content/projects.ts (sauf ajout d'image réelle pour un projet en attente), pages ComingSoon.
À NE PAS FAIRE : 3D/WebGL (Phase 5), nouvelles sections, migration CMS, publication des 4 projets sans capture.

────────────────────────────────────────
F. INSTRUCTIONS TECHNIQUES
────────────────────────────────────────
- TypeScript strict ; pas de any injustifié. Redirects/sitemap typés.
- Aucune régression visuelle : comparer avant/après (captures) sur home + 1 étude de cas.
- Mesurer : Lighthouse (mobile) sur / et une étude de cas, relever Perf/A11y/BP/SEO + LCP/CLS/INP.
- Optimisation images : documenter l'outil et les gains (Ko avant/après). Conserver une copie des originaux.
- Aucune dépendance ajoutée sans justification (une lib d'optim d'image en devDependency est acceptable SI justifiée et non requise au runtime).

────────────────────────────────────────
G. CRITÈRES D'ACCEPTATION (observables)
────────────────────────────────────────
- npm run build : 0 erreur, warning metadataBase DISPARU ; tsc --noEmit OK ; lint OK.
- sitemap.xml et robots.txt générés et corrects (études de cas incluses).
- Les 9 anciennes URLs .html renvoient un 301 vers la bonne cible (vérifié).
- Toutes les images via next/image ; LCP image en priority ; 0 CLS notable.
- Poids source des PNG > 500 Ko réduit (chiffres avant/après documentés) sans perte visuelle.
- Lighthouse mobile (objectifs) : Perf ≥ 85, A11y ≥ 95, BP ≥ 95, SEO ≥ 100 ; LCP < 2,5 s, CLS < 0,1.
- Navigation clavier complète + focus visibles ; prefers-reduced-motion respecté partout.
- 0 scroll horizontal 320→1920 ; 0 erreur console ; parité Chrome/Safari/Firefox/Android (écarts documentés).
- .env.example à jour ; procédure de déploiement documentée ; aucun déploiement/paiement déclenché.

────────────────────────────────────────
H. INCONNUES — NE PAS INVENTER
────────────────────────────────────────
- URL de prod : [NEXT_PUBLIC_SITE_URL à fournir] → utiliser la variable env + fallback localhost ; ne pas coder en dur une URL fictive.
- OG image définitive : si non fournie, générer une version sobre depuis le logo OU placeholder documenté [OG_À_PRODUIRE].
- Domaine Vercel, coordonnées réelles, clés Resend : placeholders explicites dans .env.example, à renseigner par l'utilisateur.
- 4 projets sans capture : rester non publiés.

────────────────────────────────────────
I. RAPPORT FINAL (obligatoire)
────────────────────────────────────────
1. Résumé. 2. Fichiers créés. 3. Fichiers modifiés. 4. Dépendances (idéalement 0, sinon justifiées). 5. Commandes exécutées. 6. Tests + mesures (build, tsc, lint, Lighthouse avant/après, redirections 301 vérifiées, images Ko avant/après, clavier, reduced-motion, navigateurs). 7. Limites / non fait (Phase 5 = 3D ; 4 projets en attente d'image ; déploiement à déclencher par l'utilisateur). 8. Infos/assets manquants (URL prod, OG, domaine, clés). 9. Procédure de déploiement Vercel (étapes exactes pour l'utilisateur).

CONTRAINTES : ne change pas la DA ni le contenu ; ne publie pas de projet sans image réelle ; n'installe rien de superflu ; ne déclenche aucun déploiement/paiement ; ne masque aucun problème ; ne déclare rien terminé sans mesure.
```

---

## Notes d'usage (hors bloc)

- **Avant de lancer**, fournis si possible : l'URL de prod (pour `NEXT_PUBLIC_SITE_URL`), l'image OG définitive, et le domaine visé. Sinon Claude Code utilisera des placeholders explicites.
- **Déploiement Vercel** (étape utilisateur, après cette phase) : connecter le dépôt GitHub `DamCompany-Site-` à Vercel, définir `NEXT_PUBLIC_SITE_URL` (+ éventuelles clés Resend) dans les variables d'environnement, puis déployer la branche une fois la refonte fusionnée dans `main`.
- Après la Phase 6, il ne reste que la **Phase 5** (3D/WebGL, optionnelle) et l'ajout des **4 captures** manquantes.
