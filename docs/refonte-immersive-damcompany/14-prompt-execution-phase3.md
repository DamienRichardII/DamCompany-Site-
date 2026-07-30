# 14 — Prompt d'exécution Claude Code — PHASE 3 (Homepage narrative)

> À copier dans Claude Code, à la racine du dépôt, une fois la Phase 2 validée.
> Périmètre : **construire les sections de la page d'accueil après le hero** (le récit scrollé). NE PAS refaire le hero/loader/fondations déjà en place. NE PAS construire les pages Réalisations/Services détaillées (Phase 4).

---

```text
MISSION — REFONTE IMMERSIVE DAMCOMPANY · PHASE 3 (Homepage narrative)

Lis d'abord : docs/refonte-immersive-damcompany/ (04 concept, 05 storyboard, 06 DA, 07 motion, 10 roadmap, 12 critères) + Damcompany-code-guardrails.md.
Respecte les guardrails : modification chirurgicale, zéro régression sur l'existant (loader/header/hero/fondations), aucune dépendance non justifiée.

────────────────────────────────────────
A. TON RÔLE
────────────────────────────────────────
Lead + creative developer Next.js/TS. Garant perf, responsive mobile-first, accessibilité, tests. Rien n'est « terminé » sans test.

────────────────────────────────────────
B. ÉTAT RÉEL DU DÉPÔT (déjà en place — NE PAS CASSER)
────────────────────────────────────────
- Next.js (App Router) + TypeScript, à la racine. Ancien site conservé dans /legacy-static/.
- Déjà construit (Phase 2) :
  • app/layout.tsx (fonts Space Grotesk + Poppins via next/font, LenisProvider, SEO de base)
  • app/page.tsx = <Loader/> + <Hero/> + section #vision (respiration)
  • components/layout/ : Header, MobileNav, Footer, Loader
  • components/sections/Hero.tsx
  • components/motion/ : LenisProvider, Reveal (ScrollTrigger déjà enregistré), Bolt (variants trace|pulse|spark), useReducedMotion
  • components/ui/ : Button (props: href, variant 'primary'|'secondary'), Eyebrow, ComingSoon
  • styles/tokens.css : --dc-cream/-2, --dc-black/-deep, --dc-yellow/-2, --dc-bg, --dc-bg-cine, --dc-accent, --fs-hero/h1/h2/h3/body, --focus-ring, --sh-cine
  • lib/ : fonts.ts, nav.ts (NAV_ITEMS), seo.ts (buildMetadata)
- Dépendances présentes : gsap, lenis, framer-motion. (Three.js NON installé — ne pas l'ajouter en Phase 3.)
COMMENCE PAR : lire ces fichiers pour réutiliser leurs conventions (CSS Modules, dc-container, Reveal, Bolt, tokens). Ne réécris pas ce qui existe.

────────────────────────────────────────
C. OBJECTIF DE LA PHASE 3
────────────────────────────────────────
Dérouler le récit « FROM IDEA TO INTELLIGENT PRODUCT » sous le hero, sur app/page.tsx, en remplaçant le bloc de commentaire « Sections suivantes … Phase 3 ». L'éclair jaune reste le fil conducteur animé entre les sections.

────────────────────────────────────────
D. PÉRIMÈTRE — SECTIONS À CONSTRUIRE (dans cet ordre, doc 05 storyboard #4→#13)
────────────────────────────────────────
1. LA CHAÎNE (#chaine) — 8 étapes : Idée → Stratégie → Design → Développement → Intelligence → Automatisation → Déploiement → Croissance.
   • Section sticky/pin (GSAP ScrollTrigger) : les étapes défilent, un trait-éclair vertical se remplit au scroll pour les relier (réutiliser Bolt / SVG path, transform/opacity only).
   • Fallback reduced-motion / mobile : liste ordonnée statique lisible (le pin devient un empilement vertical normal).
2. UNIVERS BUILD (#build) — registre clair. Titre monumental "BUILD". Sous-liste : sites, e-commerce, réservation, location, apps web, apps mobiles, plateformes métiers. 2–3 aperçus projets (images legacy-static).
3. TRANSITION + UNIVERS INTELLIGENCE (#intelligence) — passage clair → cinématique sombre (--dc-bg-cine) comme moment narratif. Titre "INTELLIGENCE". Sous-liste : agents IA, chatbots, automatisation, CRM, Data, reporting, tableaux de bord.
4. GALERIE (aperçu) (#realisations-preview) — grille de 6 projets max (hover riche : image + tag secteur/année), CTA "Voir toutes nos réalisations" → /realisations. PAS d'études de cas détaillées ici (Phase 4).
5. CHIFFRES CLÉS (#chiffres) — compteurs animés au scroll. Valeurs = placeholders [À_VÉRIFIER] tant que non fournies (NE PAS inventer).
6. PROCESSUS (#process) — 3 à 5 étapes de méthode, reveals échelonnés.
7. FONDATEUR / ÉQUIPE (#equipe) — portrait + citation. Si asset absent → bloc neutre + note, pas de fausse photo.
8. TÉMOIGNAGES / RÉFÉRENCES (#references) — seulement si contenu réel fourni ; sinon placeholder explicite [À_FOURNIR], pas de faux avis ni faux logos.
9. CTA CONVERSION (#cta) — "Parlons de votre projet" + Button vers /contact (+ emplacements RDV/WhatsApp/e-mail en placeholders si non fournis).
10. FOOTER — compléter le Footer existant si nécessaire (liens NAV_ITEMS, réseaux placeholders, mention, motif éclair). Ne pas le réécrire s'il est déjà complet.

────────────────────────────────────────
E. DONNÉES (source unique typée — à créer)
────────────────────────────────────────
Créer content/projects.ts et content/services.ts (types stricts). Alimenter avec les projets DONT L'ASSET EXISTE dans /legacy-static/frontend/assets/ :
UBO-DROP, UBODROP App, MA1, MA1 IA, Reset SMP, Africa2kball, Nad Motivation, I Can Play, One One Arena, KingBrel, Divan Grill, Peace of Mind Signature.
Projets SANS asset (Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100) : published:false, ne pas afficher.
Champs projet : slug, name, url?(lien réel uniquement), sector, year?, universe:'build'|'intelligence', cover, tech?[], summary?, results?[] (VIDE si non vérifié), published.

────────────────────────────────────────
F. PLAN DE FICHIERS
────────────────────────────────────────
À CRÉER :
- components/sections/ : Chain.tsx(+.module.css), UniverseBuild.tsx, UniverseIntelligence.tsx, GalleryPreview.tsx, Stats.tsx, Process.tsx, Founder.tsx, Testimonials.tsx, CtaBand.tsx (+ .module.css chacun)
- content/projects.ts, content/services.ts
- (si utile) components/ui/Card.tsx, Tag.tsx, StatCounter.tsx
À MODIFIER :
- app/page.tsx : importer et ordonner les nouvelles sections à la place du commentaire Phase 3. Garder <Loader/> + <Hero/> + #vision intacts.
- components/layout/Footer.tsx : compléter uniquement si incomplet.
À NE PAS TOUCHER : Loader, Hero, Header, MobileNav, LenisProvider, Reveal, Bolt, useReducedMotion, tokens, fonts (sauf ajout de token justifié et documenté).
À NE PAS FAIRE : pages /realisations et /services détaillées (restent ComingSoon → Phase 4) ; Three.js/WebGL (Phase 5).

────────────────────────────────────────
G. INSTRUCTIONS VISUELLES (doc 06)
────────────────────────────────────────
- Réutiliser tokens + classe dc-container. Deux registres : clair (BUILD, process, chiffres) et cinématique sombre (chaîne moments, INTELLIGENCE, CTA).
- Titres via --fs-h1/h2 + Space Grotesk ; texte Poppins. Compositions asymétriques, SANS scroll horizontal.
- ÉCLAIR = fil conducteur : trait-éclair reliant les étapes de la chaîne ; petits Bolt(variant="spark") au hover des cartes/CTA ; séparateurs d'univers avec halo jaune ; accents lumineux à l'apparition des titres.
- États hover / focus-visible / active sur tout élément interactif (--focus-ring). Aucune info/action essentielle portée uniquement par le hover.

────────────────────────────────────────
H. INSTRUCTIONS TECHNIQUES (doc 07)
────────────────────────────────────────
- Une lib par fonction : GSAP+ScrollTrigger pour scroll/pin/compteurs, Lenis déjà global, Framer Motion seulement micro-interactions ponctuelles. Pas de doublon.
- Animer transform/opacity uniquement ; gsap.context() + cleanup (ctx.revert / ScrollTrigger.kill) au démontage ; ScrollTrigger déjà synchronisé à Lenis via le provider — ne pas ré-instancier Lenis.
- TOUT respecte prefers-reduced-motion (réutiliser useReducedMotion) : pin désactivé, compteurs affichent la valeur finale, galerie statique, transitions = fondu court.
- next/image pour tous les visuels (import depuis /legacy-static/…), lazy + sizes, dimensions réservées (0 CLS).
- Server Components par défaut ; 'use client' seulement pour les sections animées.
- Mobile-first : pin/parallaxe réduits ou natifs ; tester 320→1920 ; overflow-x maîtrisé.
- Le contenu reste visible et compréhensible si le JS d'animation échoue.

────────────────────────────────────────
I. CRITÈRES D'ACCEPTATION (observables)
────────────────────────────────────────
- npm run build OK ; tsc --noEmit sans erreur ; 0 erreur console (chargement + scroll complet).
- Hero/Loader/Header inchangés et fonctionnels (aucune régression Phase 2).
- Les 8 étapes de la chaîne sont lisibles ET reliées visuellement par l'éclair ; en reduced-motion c'est une liste ordonnée claire.
- Transition BUILD→INTELLIGENCE clair→sombre fonctionnelle sur desktop et mobile.
- Galerie : 6 projets réels max, liens réels target="_blank" rel="noopener", images lazy.
- Aucun chiffre/témoignage/logo inventé ; placeholders explicites sinon.
- Aucun scroll horizontal 320→1920 ; pas de CLS notable ; animations désactivables sans casser la mise en page.
- Aucune dépendance ajoutée (périmètre B). 

────────────────────────────────────────
J. INCONNUES — NE PAS INVENTER
────────────────────────────────────────
Chiffres clés, témoignages, logos clients, portrait fondateur, coordonnées (tél/e-mail/réseaux/RDV/WhatsApp), langue FR/EN : si non fournis → placeholder explicite ([À_VÉRIFIER]/[À_FOURNIR]) + le signaler dans le rapport. Assets des 6 projets sans image : published:false.

────────────────────────────────────────
K. RAPPORT FINAL (obligatoire)
────────────────────────────────────────
1. Résumé des changements. 2. Fichiers créés. 3. Fichiers modifiés. 4. Dépendances ajoutées (attendu : aucune). 5. Commandes exécutées. 6. Tests réalisés + résultats (build, tsc, console, 320px, clavier, reduced-motion, transition d'univers). 7. Limites / non fait (pages Réalisations & Services détaillées = Phase 4 ; 3D = Phase 5). 8. Assets/infos manquants. 9. Prochaine étape (Phase 4 — études de cas).

CONTRAINTES : ne copie pas un autre site ; ne refais pas le hero ni les fondations ; n'installe rien de superflu ; ne fabrique aucun asset/chiffre absent ; ne masque aucun problème ; ne déclare rien terminé sans test.
```

---

## Notes d'usage (hors bloc)

- Après validation de cette Phase 3, enchaîner avec la **Phase 4** (études de cas `/realisations` + `[slug]`) en réutilisant la même structure, périmètre = doc `10` Phase 4.
- Renseigner en amont les placeholders connus (chiffres, coordonnées, langue) pour éviter que Claude Code s'arrête dessus.
