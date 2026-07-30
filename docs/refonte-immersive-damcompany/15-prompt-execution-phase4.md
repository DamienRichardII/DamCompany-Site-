# 15 — Prompt d'exécution Claude Code — PHASE 4 (Études de cas)

> À copier dans Claude Code, à la racine du dépôt, une fois la Phase 3 validée (idéalement dans un vrai navigateur).
> Périmètre : construire la page **/realisations** (galerie complète filtrable) et le modèle **/realisations/[slug]** (étude de cas). NE PAS retoucher la homepage, le hero, les fondations, ni les sections Phase 3.

---

```text
MISSION — REFONTE IMMERSIVE DAMCOMPANY · PHASE 4 (Études de cas)

Lis d'abord : docs/refonte-immersive-damcompany/ (05 storyboard §"étude de cas", 06 DA, 07 motion, 08 architecture, 09 assets, 10 roadmap Phase 4, 12 critères) + Damcompany-code-guardrails.md.
Respecte les guardrails : modification chirurgicale, zéro régression sur l'existant (homepage/hero/fondations/sections Phase 3), aucune dépendance non justifiée.

────────────────────────────────────────
A. TON RÔLE
────────────────────────────────────────
Lead + creative developer Next.js/TS. Garant perf, responsive mobile-first, accessibilité, SEO, tests. Rien n'est « terminé » sans test.

────────────────────────────────────────
B. ÉTAT RÉEL DU DÉPÔT (déjà en place — NE PAS CASSER)
────────────────────────────────────────
- Next.js (App Router) + TS, racine. Ancien site dans /legacy-static/. Branche feat/refonte-immersive.
- Homepage complète (Phases 2+3) : Loader, Hero, Chain, UniverseBuild, UniverseIntelligence, GalleryPreview, Stats, Process, Founder, Testimonials, CtaBand. NE PAS y toucher.
- Données projets DÉJÀ EXISTANTES — content/projects.ts :
  • type Project = { slug, name, url?, sector, year?, universe:'build'|'intelligence', cover:StaticImageData, tech?:string[], summary?:string, results:string[], published:boolean }
  • export PROJECTS (12 projets, assets réels dans legacy-static/frontend/assets/), export PUBLISHED_PROJECTS (filtre published)
  • Actuellement : sector = "[À_VÉRIFIER]", results = [], url souvent absent, pas de gallery ni contenu d'étude de cas.
- UI/motion réutilisables : components/ui/{Card,Tag,Button,Eyebrow,StatCounter}, components/motion/{Reveal,Bolt,LenisProvider,useReducedMotion}, styles/tokens.css, lib/seo.ts (buildMetadata), lib/nav.ts.
- app/realisations/page.tsx = ComingSoon (à remplacer). Pas de dossier [slug] encore.
- Dépendances : gsap, lenis, framer-motion. (Pas de CMS, pas de Three.js — ne rien ajouter en Phase 4.)
COMMENCE PAR : lire content/projects.ts, components/ui/Card.tsx, components/sections/GalleryPreview.tsx, lib/seo.ts pour réutiliser exactement leurs conventions.

────────────────────────────────────────
C. OBJECTIF DE LA PHASE 4
────────────────────────────────────────
Transformer les réalisations en PREUVES : une galerie filtrable + une étude de cas par projet (modèle unique piloté par les données). Source de contenu = fichier local typé (pas de CMS externe en Phase 4 ; l'architecture reste prête pour Sanity/Supabase plus tard, doc 08).

────────────────────────────────────────
D. PÉRIMÈTRE — À CONSTRUIRE
────────────────────────────────────────
1. ÉTENDRE le type Project (content/projects.ts) SANS casser l'existant — ajouter des champs OPTIONNELS :
   gallery?: StaticImageData[]            // captures desktop/mobile supplémentaires (assets réels only)
   context?: string                       // besoin du client
   solution?: string                      // solution créée
   features?: string[]                    // fonctionnalités
   artDirection?: string                  // parti pris DA
   // tech?[] et results[] existent déjà
   Renseigner UNIQUEMENT ce qui est factuel/déductible sans invention ; sinon laisser vide → l'UI masque proprement la section. NE PAS inventer secteurs/résultats/features.
2. PAGE GALERIE — app/realisations/page.tsx (remplace ComingSoon) :
   • Grille de tous les PUBLISHED_PROJECTS (réutiliser Card), chaque carte → /realisations/[slug].
   • Filtre par univers (Tous / BUILD / INTELLIGENCE) — accessible (boutons, aria-pressed, navigable clavier), et fonctionnel SANS JS (filtre = liens/param ou affichage complet par défaut).
   • generateMetadata (buildMetadata) : title/description/OG.
3. MODÈLE ÉTUDE DE CAS — app/realisations/[slug]/page.tsx :
   • generateStaticParams à partir de PUBLISHED_PROJECTS ; notFound() si slug inconnu ou published:false.
   • generateMetadata par projet (title = name, description = summary/context si présents, OG = cover).
   • Structure (doc 05) : Hero projet (cover plein + name + secteur·année) → Contexte & besoin → Solution → Fonctionnalités → Direction artistique → Technologies → Interfaces desktop & mobile (gallery) → Résultats (UNIQUEMENT si results non vide) → Lien vers le site (si url présent, target=_blank rel=noopener) → Navigation projet précédent/suivant.
   • CHAQUE bloc ne s'affiche QUE si sa donnée existe (context, solution, features, artDirection, tech, gallery, results, url). Pas de section vide, pas de placeholder visible côté public autre qu'un état neutre.
4. Composant réutilisable components/sections/CaseStudyNav.tsx (précédent/suivant) + éventuel components/ui/FilterTabs.tsx.

────────────────────────────────────────
E. PLAN DE FICHIERS
────────────────────────────────────────
À CRÉER :
- app/realisations/[slug]/page.tsx (+ .module.css)
- components/sections/CaseStudy*.tsx si découpage utile (Hero, Body, Nav) (+ .module.css)
- components/ui/FilterTabs.tsx (+ .module.css) si filtre client
- lib/projects.ts (helpers : getProjectBySlug, getAdjacent(prev/next), getByUniverse) — OU les ajouter dans content/projects.ts (garder une seule source).
À MODIFIER :
- app/realisations/page.tsx (remplace ComingSoon par la galerie)
- content/projects.ts (extension du type + helpers, sans casser PROJECTS/PUBLISHED_PROJECTS)
À NE PAS TOUCHER : homepage et toutes ses sections, hero, loader, header, fondations, tokens, Bolt. app/services/page.tsx reste ComingSoon (hors périmètre).
À NE PAS FAIRE : CMS externe, Three.js/WebGL, refonte des sections Phase 3.

────────────────────────────────────────
F. INSTRUCTIONS VISUELLES (doc 06)
────────────────────────────────────────
- Réutiliser tokens + dc-container + Card/Tag/Button/Eyebrow. Registre clair pour la galerie ; hero d'étude de cas possible en cinématique sombre (--dc-bg-cine).
- Titres Space Grotesk (--fs-h1/h2), texte Poppins. Compositions éditoriales, généreuses, SANS scroll horizontal.
- Éclair signature : Bolt(variant="spark") au hover des cartes galerie ; petit éclair séparateur entre les blocs d'étude de cas ; accent jaune sur les liens.
- États hover / focus-visible / active partout (--focus-ring). Filtre : état actif visible ET annoncé (aria-pressed).
- next/image pour cover + gallery : lazy (cover du hero de case study = priority), sizes corrects, ratio réservé (0 CLS).

────────────────────────────────────────
G. INSTRUCTIONS TECHNIQUES (doc 07/08)
────────────────────────────────────────
- Pages statiques (SSG) : generateStaticParams + generateMetadata. Server Components par défaut ; 'use client' seulement pour le filtre et les micro-animations.
- Réutiliser Reveal pour les apparitions ; respecter prefers-reduced-motion (useReducedMotion) ; animer transform/opacity uniquement ; cleanup ScrollTrigger si utilisé.
- Filtre galerie : dégradable — sans JS, toutes les cartes restent visibles (le filtre est une amélioration, pas un prérequis d'accès au contenu).
- TypeScript strict, pas de any injustifié ; le type Project reste rétro-compatible (champs ajoutés = optionnels).
- SEO : slugs stables, metadata par page, OG = cover réelle ; préparer (pas obligatoire) l'ajout futur des redirections 301 (Phase 6).
- Mobile-first, tester 320→1920, overflow-x maîtrisé. Contenu lisible si JS d'animation échoue.

────────────────────────────────────────
H. CRITÈRES D'ACCEPTATION (observables)
────────────────────────────────────────
- npm run build OK (SSG des [slug] générés) ; tsc --noEmit sans erreur ; npm run lint OK ; 0 erreur console.
- Homepage + sections Phase 3 inchangées et fonctionnelles (aucune régression).
- /realisations affiche les 12 projets publiés ; chaque carte ouvre son étude de cas ; filtre univers fonctionne au clavier ET sans JS.
- /realisations/[slug] : slug valide = page complète ; slug inconnu/non publié = 404 (notFound).
- Aucune section d'étude de cas vide affichée ; blocs conditionnés à la présence de données.
- Aucun secteur/résultat/fonctionnalité inventé ; ce qui manque reste vide ou en état neutre, jamais fabriqué.
- Liens externes réels uniquement, target=_blank rel=noopener.
- 0 scroll horizontal 320→1920 ; pas de CLS notable ; animations désactivables.
- Aucune dépendance ajoutée.

────────────────────────────────────────
I. INCONNUES — NE PAS INVENTER
────────────────────────────────────────
- sector des 12 projets, results chiffrés, url de certains projets, context/solution/features/artDirection, images gallery supplémentaires (seules celles réellement dans legacy-static/ sont utilisables) : si absent → champ vide, bloc masqué. Signaler dans le rapport la liste des projets incomplets et ce qu'il faut fournir.
- Ne publier une étude de cas riche que pour les projets disposant d'un minimum de contenu réel ; sinon la page reste sobre (hero + cover + lien) sans blocs fabriqués.

────────────────────────────────────────
J. RAPPORT FINAL (obligatoire)
────────────────────────────────────────
1. Résumé. 2. Fichiers créés. 3. Fichiers modifiés. 4. Dépendances (attendu : aucune). 5. Commandes exécutées. 6. Tests (build/SSG, tsc, lint, console, 320px, clavier, filtre sans JS, 404 slug inconnu, reduced-motion). 7. Limites / non fait (services détaillés, 3D = plus tard ; CMS = optionnel futur). 8. Champs/assets manquants par projet (tableau). 9. Prochaine étape (Phase 5 — expériences avancées, ou Phase 6 — optimisation/SEO/redirections selon priorité).

CONTRAINTES : ne copie pas un autre site ; ne touche pas à la homepage/hero/fondations ; n'installe rien de superflu ; ne fabrique aucun contenu/asset absent ; ne masque aucun problème ; ne déclare rien terminé sans test.
```

---

## Notes d'usage (hors bloc)

- **Fortement recommandé avant de lancer :** fournir un CSV/liste avec, par projet, `sector`, `url`, 1–2 phrases `context/solution`, `tech`, `results` vérifiés. Sans ça, les études de cas resteront volontairement sobres (pas de contenu inventé). C'est le principal levier de qualité de cette phase.
- Ordre conseillé ensuite : Phase 6 (optimisation, SEO, redirections 301 des anciennes URLs `.html`) avant Phase 5 (3D/WebGL) si la priorité est la mise en production.
- Rappeler à Claude Code de lire `Damcompany-code-guardrails.md`.
