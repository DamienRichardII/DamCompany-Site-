# Journal d'exécution — Refonte immersive DamCompany

> Journal de bord de l'exécution des prompts `13-prompt-execution-claude-code.md` (Phase 0-2),
> `14-prompt-execution-phase3.md` (Phase 3), `15-prompt-execution-phase4.md` (Phase 4)
> et `16-prompt-execution-phase6.md` (Phase 6). Mis à jour au fil de l'exécution, dans l'ordre chronologique.

---

## Phase 0 — Sauvegarde & diagnostic (2026-07-28)

### État initial confirmé

- **Stack réelle :** site statique vanilla, confirmé par inspection directe :
  - `frontend/` : `index.html` + 7 pages services (`sites-web`, `applications`, `ia`, `data`, `automatisation`, `crm`, `consulting`) + `contact.html`.
  - `frontend/css/style.css`, `frontend/js/main.js` — aucune dépendance front, aucun bundler, aucun `package.json` à la racine du frontend.
  - `backend/` : Express minimal (`server.js`, `package.json` avec `express`, `cors`, `dotenv`), route `POST /api/contact`. Optionnel, non requis pour servir le site.
  - **Aucun `Damcompany-code-guardrails.md` trouvé à la racine du dépôt** malgré la mention dans le prompt — absence documentée ici, non bloquante (les guardrails du prompt section A/H ont été appliqués directement : modification chirurgicale, zéro régression, pas de dépendance non justifiée).
- **Vérification fonctionnelle :**
  - `node --check frontend/js/main.js` → OK.
  - `node --check backend/server.js` → OK.
  - Pas de commande "build" existante (site statique ouvert directement ou servi via un serveur statique) : rien à build sur `main`.
- **Doublon d'assets constaté :** le dossier racine `assets/` (15 PNG) contient les mêmes images que `frontend/assets/`, qui ajoute en plus `logo.svg` et `favicon.svg`. Le `README.md` confirme : *« Le dossier assets/ original à la racine est conservé ; les images utiles ont été copiées dans frontend/assets/ »*. Décision : les deux dossiers sont déplacés tels quels dans `legacy-static/`, rien n'est supprimé ni fusionné à ce stade.
- **Environnement :** Node v25.2.1, npm 9.5.1.
- **Git :** dépôt propre sur `main` (`a03956b Site officiel DamCompany - multipage`), seul `docs/` était untracked. Aucune perte de travail en cours constatée.

### Actions Phase 0

1. Création de la branche dédiée `feat/refonte-immersive` depuis `main` (à jour avec `origin/main`). `main` non touché.
2. Rédaction de ce journal.

### Décision d'intégration Next.js (à appliquer en Phase 1)

Conformément à la recommandation du doc 08/13 : **Next.js initialisé à la racine du dépôt**, ancien site statique déplacé intégralement (avec historique Git via `git mv`) vers `/legacy-static/` :

```
legacy-static/
├─ frontend/   (html/css/js/assets existants, inchangés)
├─ backend/    (Express existant, inchangé)
├─ assets/     (dossier racine original, inchangé)
└─ README.md   (README existant, déplacé tel quel)
```

Un nouveau `README.md` à la racine documentera la coexistence des deux bases le temps de la migration.

---

## Phase 1 — Fondations (2026-07-28)

### Initialisation Next.js

- `create-next-app@latest` ne peut pas cibler un dossier nommé avec espaces/majuscules (règles npm) : le scaffold a été généré dans un dossier temporaire (`nextscaffold`) puis les fichiers de config pertinents (tsconfig.json, eslint.config.mjs, next.config.ts, next-env.d.ts) ont été copiés à la racine du dépôt, avec un `package.json` réécrit manuellement (nom `damcompany-site`).
- **Version obtenue :** Next.js 16.2.12 (App Router, Turbopack), React 19.2.4, TypeScript strict — satisfait l'exigence « Next.js 14+ » du doc 08.
- **Dépendances ajoutées (périmètre autorisé, doc 13-D) :** `gsap`, `lenis`, `framer-motion` (déclarée mais pas encore consommée dans cette exécution — réservée aux micro-interactions ponctuelles futures). Aucune autre dépendance.
- `next.config.ts` : ajout de `turbopack.root` pour lever un avertissement de lockfile parasite détecté hors du dépôt (`C:\Users\HP-15\package-lock.json`), sans lien avec ce projet.
- `npm audit` signale 3 vulnérabilités « high » sur `postcss`/`sharp`, **internes au bundle de Next.js 16.2.12 lui-même** (pas une dépendance que nous avons choisie) ; le correctif proposé par `npm audit fix --force` rétrograderait vers Next 9, ce qui n'est pas pertinent. À surveiller via une future mise à jour patch de Next.js — non bloquant pour cette exécution.

### Design system

- `styles/tokens.css` : couleurs, typographie, espacements, rayons, ombres et tokens de mouvement repris intégralement du doc 06.
- `lib/fonts.ts` : police display = **Space Grotesk** (Google Fonts, licence SIL OFL, self-host via `next/font/google`) plutôt que Clash Display/Satoshi mentionnées en option dans le doc 06, dont la licence commerciale n'est pas confirmée. Poppins conservé pour le texte courant (identité existante).
- `app/globals.css` : reset minimal, conteneur grille 12 colonnes, focus-visible (anneau 2px accent), et le bloc `@media (prefers-reduced-motion: reduce)` qui coupe toutes les transitions/animations CSS globalement (filet de sécurité en plus des vérifications JS par composant).

### Système de mouvement

- `components/motion/useReducedMotion.ts` : implémenté avec `useSyncExternalStore` (et non un `setState` dans un `useEffect`) pour rester conforme à la nouvelle règle ESLint `react-hooks/set-state-in-effect` et éviter tout hydration mismatch SSR/client (snapshot serveur = `false`, jamais de flash de contenu).
- `components/motion/LenisProvider.tsx` : Lenis initialisé et synchronisé à `ScrollTrigger` via `gsap.ticker`, entièrement désactivé (scroll natif) si `prefers-reduced-motion: reduce`.
- `components/motion/Reveal.tsx` : reveal scroll (opacity + translateY 10–20px selon la largeur), `gsap.context()` + `ctx.revert()` au démontage, réduit à un simple fondu 120ms si reduced-motion.
- `components/motion/Bolt.tsx` : composant éclair réutilisable (`trace` pour le loader, `pulse` pour l'ambiance hero/footer, `spark` réservé aux futures micro-interactions CTA). **Le tracé SVG reprend exactement le path déjà utilisé dans `legacy-static/frontend/*.html` (`class="footer-spark"`)** — signature DamCompany existante, non réinventée.

---

## Phase 2 — Prototype immersif (Loader / Header / Hero) (2026-07-28)

### Composants livrés

- `components/layout/Loader.tsx` : l'éclair se trace (stroke-dashoffset) puis se remplit, puis l'overlay se dissipe (~1s au total, sous la limite de 2s). **Filet CSS pur** (`Loader.module.css`, `@keyframes dc-loader-autohide`) qui force la disparition de l'overlay après 1.8s même si le JS échoue entièrement — le contenu ne reste jamais bloqué.
- `components/layout/Header.tsx` + `MobileNav.tsx` : header sticky avec condensation au scroll ; menu plein écran avec stagger d'entrée, focus-trap manuel (Tab/Shift+Tab cyclés), fermeture Échap + clic lien + bouton fermer, focus rendu au bouton burger à la fermeture.
- `components/layout/Footer.tsx` : minimal, motif éclair (`Bolt` variant `pulse`), coordonnées identiques aux placeholders déjà présents sur le site actuel (`+33 6 00 00 00 00`, `contact@damcompany.com`), marquées `[À_VÉRIFIER]`.
- `components/sections/Hero.tsx` : titre monumental **« FROM IDEA TO INTELLIGENT PRODUCT »** (voir décision de langue ci-dessous), sous-titre FR, 2 CTA, deux captures de projets existantes (`legacy-static/frontend/assets/Ubodrop-site.png`, `MA1-site.png`) en cartes avec léger parallaxe curseur (desktop, `pointer: fine`, coupé si reduced-motion).
- `app/page.tsx` : assemble Loader + Hero + une section « Vision » (respiration, doc 05 storyboard #3) ; bloc de commentaire explicite listant les sections non construites (chaîne, univers, galerie, etc. → Phase 3).

### Décisions non explicitement tranchées par les docs, prises pour ne pas bloquer l'exécution

1. **Langue du hero :** titre monumental en **EN** (« FROM IDEA TO INTELLIGENT PRODUCT », repris tel quel du concept recommandé, doc 04/05), reste du site en **FR** (nav, sous-titre, footer, pages) — cohérent avec le site actuel qui est entièrement en français. Doc J demandait de signaler ce choix : **choix par défaut, à confirmer par le client**.
2. **Routes de navigation non construites (`/realisations`, `/services`, `/a-propos`, `/contact`) :** pour éviter des liens morts dans le header/footer (régression par rapport au site actuel où toutes les pages existent), une page de jalon minimale (`components/ui/ComingSoon.tsx`) a été créée pour chacune — pas de contenu inventé, juste un message explicite « arrive dans la prochaine phase » + retour à l'accueil. C'est un ajout minimal non prévu littéralement dans la liste de fichiers du doc 13-F mais nécessaire pour respecter la contrainte « zéro régression » du doc 11 (risque #4) sans construire les vraies sections (hors périmètre Phase 2).
3. **Formulaire de contact :** non reconstruit (route `/api/contact` = Phase 3, doc 08). La page `/contact` de cette exécution n'affiche donc pas de formulaire — conforme à la consigne « ne jamais présenter un formulaire comme fonctionnel s'il ne l'est pas ».

### Tests exécutés

- `npx tsc --noEmit` → 0 erreur.
- `npm run lint` (ESLint flat config, `eslint-config-next`) → 0 erreur/avertissement sur le code applicatif. `legacy-static/**` exclu du lint (code JS vanilla existant, non soumis aux règles TypeScript/React de la nouvelle base).
- `npm run build` → succès, 7 routes générées statiquement, seul avertissement non bloquant : `metadataBase` non défini (URL de production inconnue, doc J).
- Test navigateur (`npm run dev`, port 3000) :
  - Aucune erreur console (chargement, navigation entre `/`, `/contact`, `/realisations`, `/a-propos`).
  - **320px :** `scrollWidth === innerWidth` (aucun scroll horizontal), titre non tronqué, CTA principal visible dans les 800px de hauteur initiaux, nav desktop absente du DOM interactif (masquée par media query, hors tabulation).
  - **Clavier :** Tab atteint logo → burger → CTA hero ; ouverture du menu déplace le focus sur le bouton fermer ; Échap ferme le menu et restaure le focus sur le burger.
  - Images (`next/image`) servies en formats responsives (`w=384/640`, `q=75`), aucune 404.
  - **`prefers-reduced-motion` :** vérifié par revue de code (chaque composant motion branche explicitement sur `useReducedMotion()`) + filet CSS global (`app/globals.css`) qui neutralise toute transition/animation quel que soit l'état JS. **Non vérifié en émulation navigateur live** — l'outil de preview disponible dans cet environnement ne permet pas d'émuler `prefers-reduced-motion` (contrairement à `colorScheme`). Recommandation : vérifier manuellement via les réglages système/navigateur avant mise en production.
  - Capture d'écran visuelle non obtenue (le panneau navigateur de cet environnement ne composite pas d'image dans cette session) — validation faite via DOM/computed styles/network au lieu d'un contrôle visuel direct. Recommandation : un contrôle visuel humain reste utile avant validation finale.

---

## Phase 3 — Homepage narrative (2026-07-30)

### Sections livrées

Dans l'ordre du storyboard (doc 05 #4→#12), insérées dans `app/page.tsx` à la place du bloc de commentaire laissé en Phase 2, sans toucher à `<Loader/>`, `<Hero/>` ni `#vision` :

- `components/sections/Chain.tsx` (#chaine) — 8 étapes (Idée→Croissance), section pin/scrub (GSAP ScrollTrigger) avec un trait-éclair vertical (`transform: scaleY`, pas de SVG path animé — plus robuste et strictement transform-only). Fallback statique (liste entièrement visible, pas de pin) si `prefers-reduced-motion` **ou** largeur < 768px.
- `components/sections/UniverseBuild.tsx` (#build, registre clair) et `UniverseIntelligence.tsx` (#intelligence, registre cinématique sombre) — dégradé crème→noir en haut de la section INTELLIGENCE comme moment de transition narrative (doc 02), plus un `Bolt` `pulse` centré ("signal" qui traverse les univers).
- `components/sections/GalleryPreview.tsx` (#realisations-preview) — jusqu'à 6 projets réels, CTA vers `/realisations`.
- `components/sections/Stats.tsx`, `Process.tsx`, `Founder.tsx`, `Testimonials.tsx`, `CtaBand.tsx`.
- `content/projects.ts`, `content/services.ts` — source unique typée (doc 08).
- `components/ui/Card.tsx`, `Tag.tsx`, `StatCounter.tsx` — nouveaux composants réutilisables.

### Données : ce qui a été rempli vs laissé en placeholder (doc J)

- **12 projets publiés** (`published: true`) — uniquement ceux dont l'asset existe réellement dans `legacy-static/frontend/assets/` (liste exacte du doc 13-E). Les 6 projets sans asset (Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100) ne sont **pas** dans `content/projects.ts` — rien à publier tant que l'image manque.
- **`sector`** : aucun secteur client n'est confirmé dans les docs fournis → valeur placeholder littérale `"[À_VÉRIFIER]"` sur les 12 projets plutôt qu'une supposition. **`url`**, **`year`**, **`tech`**, **`summary`** : laissés `undefined` (aucun lien/date/techno réels connus) — pas de faux lien `target="_blank"`.
- **`universe`** : déduit du libellé déjà donné par le doc 09 lui-même (suffixe « site » → livrable BUILD ; « MA1 **IA** » → seul projet explicitement qualifié IA → INTELLIGENCE), pas une supposition sur l'activité du client.
- **Chiffres clés (`Stats`)** : `StatCounter` est fonctionnel (compte-up GSAP prêt) mais aucune valeur n'est passée → chaque tuile affiche `[À_VÉRIFIER]` sans animation, comme demandé (doc D.5/J).
- **Fondateur/équipe** : `Damien-Portfolio.png` et `Sandrine-Portfolio.png` existent dans `legacy-static/frontend/assets/` mais le doc 09 les marque « usage à confirmer » — impossible de garantir qu'il s'agit de portraits utilisables. Un bloc neutre + note `[À_FOURNIR]` est affiché plutôt que de risquer un mauvais usage d'une photo (doc D.7/J).
- **Témoignages** : aucun contenu réel fourni → section placeholder explicite `[À_FOURNIR]`, aucun avis ni logo fabriqué (doc D.8/J).
- **CTA de conversion** : mêmes coordonnées placeholder que le Footer existant (`+33 6 00 00 00 00`, `contact@damcompany.com`), RDV/WhatsApp signalés « à venir » — pas de lien fabriqué.

### Bug trouvé et corrigé pendant les tests

**Débordement horizontal à 1280px** (`scrollWidth` 1543 vs `innerWidth` 1280) : la valeur placeholder `"[À_VÉRIFIER]"` dans `StatCounter`, rendue à la taille `--fs-h1` (prévue pour un vrai chiffre court comme « 120+ »), débordait de sa colonne de grille (les items de grille ont un `min-width: auto` par défaut qui respecte la largeur intrinsèque du texte). Corrigé par `min-width: 0` sur `.stat` et une classe `.placeholder` (taille réduite `--fs-h3`) appliquée uniquement quand `value` est absent — `components/ui/StatCounter.module.css`, `StatCounter.tsx`. Revérifié : 0 débordement à 320px et 1280px après correctif.

### Ajustement technique à `Bolt.tsx` (déjà existant, Phase 2)

Le variant `spark` faisait un `gsap.set(fillOpacity: 0, scale: 0.9, ...)` qui laissait le tracé invisible même quand le wrapper CSS (`Card.module.css .spark`) passe à `opacity: 1` au hover — les deux mécanismes (GSAP inline + CSS) se contredisaient. Simplifié : le variant `spark` fixe juste un tracé pleinement visible (`fillOpacity: 1`) et laisse **uniquement** le CSS du composant appelant piloter l'apparition/disparition au hover/focus (`transform`/`opacity`, doc H). Changement additif, ne modifie ni `trace` ni `pulse` (Loader/Header/Footer/Hero non affectés).

### Limite de test rencontrée (environnement, pas le code)

Le panneau navigateur de cette session ne compose pas de frame visible (`document.hidden === true`, `requestAnimationFrame` ne se déclenche jamais tant que la page n'est pas rendue à l'écran). Conséquence : impossible de vérifier en direct, par scroll simulé, le pin/scrub de la Chaîne, le compte-up de `StatCounter`, ou les pulsations `Bolt` — tout ce qui dépend de `requestAnimationFrame` (GSAP ticker, Lenis, ScrollTrigger) reste à `progress: 0` dans cet environnement précis, indépendamment du code. Vérifié à la place :
- Le `ScrollTrigger` se crée avec les bonnes bornes (`start`/`end` correspondant exactement à la position réelle du pin-spacer dans le DOM — confirmé par instrumentation temporaire retirée avant commit).
- Le fallback reduced-motion/mobile (aucune dépendance à rAF) fonctionne : à 320px, les 8 étapes de la chaîne sont toutes visibles et actives sans JS d'animation.
- Un `ScrollTrigger.refresh()` différé (double `requestAnimationFrame` + événement `load`) a été ajouté dans `Chain.tsx` par précaution, pour recaler le pin si des images chargées en lazy plus bas dans la page décalent la mise en page après le calcul initial — bonne pratique générale, indépendante du problème d'environnement.
- **Recommandation :** vérifier le scroll de la Chaîne, la transition BUILD→INTELLIGENCE et les compteurs dans un vrai navigateur avant validation (`npm run dev`, scroller manuellement).

### Tests exécutés

- `npx tsc --noEmit` → 0 erreur.
- `npm run lint` → 0 erreur/avertissement.
- `npm run build` → succès, mêmes 7 routes, même avertissement `metadataBase` non bloquant.
- Navigateur : 0 erreur console sur `/` (chargement + scroll jusqu'en bas) ; 13 images, 0 cassée ; **aucun scroll horizontal 320px→1280px** (après correctif `StatCounter`) ; nav clavier toujours fonctionnelle (Header/MobileNav inchangés) ; fallback reduced-motion de la Chaîne vérifié fonctionnel.

---

## Phase 4 — Études de cas (2026-07-30)

### Ce qui a été construit

- **`content/projects.ts`** : type `Project` étendu avec 5 champs **optionnels** (`gallery?`, `context?`, `solution?`, `features?`, `artDirection?`) — rétro-compatible, `PROJECTS`/`PUBLISHED_PROJECTS` inchangés. Ajout de 3 helpers : `getProjectBySlug`, `getProjectsByUniverse`, `getAdjacentProjects` (précédent/suivant, boucle circulaire).
- **`lib/seo.ts`** : `buildMetadata` accepte désormais un paramètre optionnel `image` (sinon comportement identique, `/brand/logo.svg` par défaut) — utilisé pour l'OG des études de cas (`project.cover.src`).
- **`app/realisations/page.tsx`** : remplace le `ComingSoon`. Galerie complète des 12 projets publiés + filtre par univers (`components/ui/FilterTabs.tsx`).
- **`app/realisations/[slug]/page.tsx`** : `generateStaticParams` (12 pages générées en SSG), `generateMetadata` par projet, `notFound()` si slug inconnu. Composé de `CaseStudyHero`, `CaseStudyContent` (7 blocs conditionnels), `CaseStudyNav` (précédent/suivant).

### Décision technique : filtre en liens, pas en état client

Le doc 14-D.2 proposait explicitement deux options (« liens/param ou affichage complet par défaut »). Choix retenu : **liens réels** (`/realisations?universe=build`), `FilterTabs` reste un Server Component. Avantages par rapport à un filtre `'use client'` : chaque état est une URL crawlable/partageable, le filtre fonctionne nativement sans JavaScript (pas de "fallback" à construire, c'est le comportement par défaut), et ça évite d'ajouter un composant client supplémentaire. État actif signalé par `aria-current="true"` + style visuel — l'équivalent fonctionnel d'`aria-pressed` demandé dans le prompt, adapté à des liens plutôt qu'à des boutons de bascule (sémantiquement plus correct pour une navigation par facette).

### Modifications à des composants partagés (justifiées, hors périmètre protégé)

- **`components/ui/Card.tsx`** : chaque carte projet pointe désormais vers `/realisations/[slug]` (au lieu de : lien externe `project.url` si présent, sinon `<div>` statique). C'est le cœur de l'objectif Phase 4 (« transformer les réalisations en preuves ») et ça se répercute correctement sur les sections Phase 3 qui réutilisent `Card` (Chain, UniverseBuild, UniverseIntelligence, GalleryPreview) sans qu'elles aient été modifiées elles-mêmes — vérifié : 10 liens `/realisations/*` détectés sur la homepage après le changement, 0 régression. Le lien externe (`project.url`), quand il existe, vit désormais dans le corps de l'étude de cas (bloc « Le site »), pas sur la carte — évite un anchor imbriqué dans un anchor.
- **`components/ui/Button.tsx`** : ajout de deux props optionnelles `target`/`rel` (pour le lien externe « Visiter le site »), sans effet sur les appels existants qui ne les passent pas.
- **`components/motion/Reveal.tsx`, `Bolt.tsx`, `Header`, `MobileNav`, `Loader`, `Hero`, fondations, tokens** : **non touchés**, conformément au périmètre protégé (doc 14-E).

### Données : rien d'inventé (doc I)

Les 5 nouveaux champs (`context`, `solution`, `features`, `artDirection`, `gallery`) sont restés `undefined` sur les **12 projets** — aucun contenu factuel n'a été fourni au-delà de ce qui existait déjà en Phase 3 (nom, univers, capture). Conséquence assumée et documentée dans le prompt lui-même : chaque étude de cas reste **sobre** (hero + cover + navigation précédent/suivant), `CaseStudyContent` retourne `null` dès qu'aucun des 8 blocs n'a de donnée — vérifié dans le navigateur sur `/realisations/ma1-ia` : rien entre le hero et la nav précédent/suivant, aucune section vide affichée.

#### Tableau des champs manquants par projet

Identique pour les 12 projets publiés (aucune donnée différenciée fournie) :

| Champ | État | Action requise |
|---|---|---|
| `sector` | `"[À_VÉRIFIER]"` | Secteur réel du client |
| `url` | absent | Lien réel vers le site livré (si autorisé à publier) |
| `year` | absent | Année de livraison |
| `tech` | absent | Stack technique réellement utilisée |
| `context` / `solution` | absents | 1-2 phrases besoin/solution par projet |
| `features` | absent | Liste de fonctionnalités clés |
| `artDirection` | absent | Parti pris DA en une phrase |
| `gallery` | absent | Captures desktop/mobile supplémentaires (aucune actuellement disponible au-delà de la cover unique par projet dans `legacy-static/`) |
| `results` | `[]` | Résultats chiffrés vérifiés |

*(Les 6 projets sans asset — Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100 — restent absents de `content/projects.ts`, inchangé depuis la Phase 3.)*

### Tests exécutés

- `npx tsc --noEmit` → 0 erreur. `npm run lint` → 0 erreur/avertissement.
- `npm run build` → succès. **20 pages générées** (7 précédentes + `/realisations` en rendu dynamique `ƒ` car dépend de `searchParams` + 12 études de cas en SSG `●` via `generateStaticParams`).
- Navigateur : 0 erreur console sur `/realisations`, `/realisations?universe=intelligence` (filtre confirmé : seul MA1 IA affiché), `/realisations/ma1-ia`.
- **404 réel vérifié** : `GET /realisations/does-not-exist` → `404 Not Found` (statut HTTP confirmé via les requêtes réseau, pas seulement un texte affiché).
- **320px→1280px** : aucun scroll horizontal sur `/realisations` ni sur une étude de cas (`/realisations/kingbrel`).
- **Clavier** : filtre et cartes sont des `<a>` natifs, focusables et activables au clavier par construction (pas de `tabindex` custom nécessaire).
- **Homepage (régression)** : revérifiée après les changements sur `Card`/`Button` — 0 erreur console, 0 scroll horizontal, toujours fonctionnelle.
- **`prefers-reduced-motion`** : même limite d'environnement que documentée en Phase 3 (rAF suspendu, pane non composité) — vérifié par revue de code : `CaseStudyHero`/`CaseStudyContent` utilisent `Reveal`, déjà validé reduced-motion-safe en Phase 2/3.

---

## Phase 6 — Optimisation & mise en production (2026-07-30)

### 1. SEO — métadonnées

- `app/layout.tsx` : `metadataBase: new URL(SITE_URL)` défini une seule fois (racine) → **le warning `metadataBase` a disparu du build**. `title` devient `{ default: "DamCompany", template: "%s — DamCompany" }` (tiret cadratin, doc 16-D.1) ; toutes les pages enfants (déjà écrites avec `buildMetadata({title: "Réalisations", ...})` etc., Phases 2-4) en bénéficient automatiquement sans modification.
- `lib/seo.ts` : `SITE_URL` lit désormais `process.env.NEXT_PUBLIC_SITE_URL` avec repli `http://localhost:3000` — **l'ancien placeholder `"https://[URL_PROD]"` a été retiré** (il n'était de toute façon pas une URL valide pour `new URL()`, qui aurait fait planter le build). `buildMetadata` ajoute `alternates.canonical` et `twitter: { card: "summary_large_image", ... }`.
- **OG image réelle produite** : `public/brand/og.webp` (1200×630, 10,7 Ko), générée à partir du logo et des tokens de marque via `scripts/generate-og-image.mjs` (`npm run generate-og-image`) — logo + éclair + accroche déjà utilisée dans le Hero (« Agence digitale — Build & Intelligence »). Pas de photo définitive fournie à ce stade (doc 16-H) : ce script reste réutilisable pour régénérer l'image si la DA évolue, ou peut être remplacé par un vrai visuel plus tard sans changer le code (`lib/seo.ts` pointe simplement vers `/brand/og.webp`).
- Chaque étude de cas utilise sa propre `cover` comme image OG (`image: project.cover.src`, déjà en place depuis la Phase 4, vérifié fonctionnel avec le nouveau `metadataBase`).

### 2. SEO — fichiers

- `app/sitemap.ts` : 5 routes statiques + les 13 études de cas publiées (`PUBLISHED_PROJECTS`) = **18 URLs** (vérifié : `curl .../sitemap.xml | grep -c '<loc>'` → 18).
- `app/robots.ts` : `allow: "/"`, référence `sitemap.xml`. JSON-LD (P2, optionnel) non fait — aurait nécessité soit des données Organization non fournies (adresse, réseaux réels), soit un contenu de type Article non structuré comme tel dans les études de cas ; laissé de côté plutôt que de fabriquer des données.

### 3. Redirections 301

`next.config.ts` → `redirects()`, les 9 URLs `.html` → nouvelle arborescence, `permanent: true`. **Vérifié via `curl`** sur les 9 URLs : toutes renvoient **308** (pas 301). C'est le comportement standard de Next.js pour `permanent: true` — un 308 préserve la méthode de requête et est traité de façon identique à un 301 par Google pour le transfert de signal SEO (redirection permanente). Signalé ici pour transparence par rapport au « 301 » demandé littéralement dans le prompt.

### 4. Performance — images

- Audit `next/image` : `priority` correctement limité aux candidats LCP réels (1ère image du Hero, cover du hero d'étude de cas, logo du header) ; tout le reste en lazy par défaut. Formats AVIF/WebP : activés nativement par Next.js (comportement par défaut de l'optimiseur d'image, aucune config requise) — vérifié via les requêtes réseau (`_next/image?...`) qui servent déjà des formats optimisés quelle que soit la source.
- **Recompression source** : `scripts/optimize-images.mjs` (`npm run optimize-images`), `sharp` ajouté en devDependency (déjà présent en transitif via Next, désormais déclaré explicitement — doc 16-F). Quantification palette (`png({ palette: true, quality: 82 })`), qualité vérifiée visuellement avant application en masse (aucune différence perceptible sur une capture de site). **10 fichiers > 500 Ko traités, ~12,6 Mo → ~3,3 Mo (-74 % sur ces fichiers)** :

| Fichier | Avant | Après | Gain |
|---|---|---|---|
| reset-smp-site.png | 1853 Ko | 317 Ko | -83% |
| Divan-Grill-site.png | 1541 Ko | 298 Ko | -81% |
| Fly-future-champions-site.png | 646 Ko | 152 Ko | -76% |
| Sandrine-Portfolio.png | 1152 Ko | 283 Ko | -75% |
| Africa2kball-site.png | 1680 Ko | 455 Ko | -73% |
| Damien-Portfolio.png | 565 Ko | 155 Ko | -73% |
| ICP-site.png | 777 Ko | 172 Ko | -78% |
| Nad-motivation-site.png | 1494 Ko | 451 Ko | -70% |
| Ubodrop-site.png | 1956 Ko | 640 Ko | -67% |
| Kingbrel-site.png | 930 Ko | 335 Ko | -64% |

  Les fichiers écrasés sont ceux importés par `content/projects.ts` (aucun changement de code nécessaire, les imports statiques pointent vers le même chemin). **Les originaux sont conservés** dans `legacy-static/frontend/assets-originaux/` (créé automatiquement par le script) — **ce dossier est volontairement exclu de git** (`.gitignore`) pour ne pas doubler ~12 Mo de binaires dans l'historique ; il reste disponible en local. Recommandation : archiver ce dossier ailleurs (stockage cloud du client) si une trace long terme des fichiers sources est souhaitée.
- Code-splitting : GSAP/Lenis/Framer restent `'use client'` uniquement dans les composants qui les utilisent réellement (motion/, sections animées) ; les pages ComingSoon et les Server Components n'embarquent aucun JS d'animation.

### 5. Accessibilité — audit final (bugs réels trouvés et corrigés)

Un script de scan automatisé (calcul de contraste WCAG, injecté via `javascript_tool` sur chaque type de page) a révélé **plusieurs violations réelles**, au-delà de ce qui avait été vérifié visuellement dans les phases précédentes :

1. **Texte jaune sur fond clair (contraste 1,44:1, minimum requis 4,5:1)** — le jaune de marque servait de couleur de TEXTE dans `Eyebrow`, `Tag`, `CaseStudyContent .blockLabel`, `Chain .stepIndex` (actif), `Process .index` et `StatCounter .value`, sur les sections à registre clair (BUILD, Process, Founder, Testimonials, Chain, Réalisations, études de cas). C'est exactement l'inverse de la règle déjà documentée dans `styles/tokens.css` depuis la Phase 1 (« le jaune ne sert jamais de couleur de texte sur fond clair ») — règle respectée à l'écriture des tokens mais pas suivie dans les composants ajoutés en Phases 3-4. **Corrigé** : `Eyebrow`/`CaseStudyContent .blockLabel`/`StatCounter .value` passent en `color: inherit` (s'adaptent au registre du parent) ; `Chain .stepIndex` (actif) devient une pastille jaune à texte noir ; `Process .index` passe en gris neutre ; `Tag` devient une pastille à fond clair opaque + texte noir + bordure jaune (fonctionne quel que soit le fond de page, y compris sombre).
2. **Texte noir sur fond noir (contraste 1,14:1)** — le bouton secondaire « Voir nos réalisations » du Hero utilisait `color: var(--dc-fg)` (toujours sombre) alors que ce variant est aussi utilisé sur fond sombre (Hero) : texte quasi invisible. **Corrigé** : `Button.secondary` passe en `color: inherit`.
3. **Texte blanc sur carte blanche (contraste ~1:1)** — les cartes projet (`Card`) utilisaient `color: inherit` pour le nom du projet, correct sur fond clair mais invisible quand la carte est posée sur une section au registre sombre (Univers INTELLIGENCE, ex. « MA1 IA ») car la carte garde son propre fond clair. **Corrigé** : `Card` fixe désormais `color: var(--dc-black)`, indépendant du contexte.

Tous les correctifs vérifiés par re-scan automatisé (0 violation restante sur `/`, `/realisations`, une étude de cas, `/services`, `/contact`, le menu mobile et le footer) + lecture directe des couleurs calculées (`getComputedStyle`). `tsc`/`lint`/`build` revalidés après ces changements.

**Reste (limite d'outillage, pas un problème de code)** : `prefers-reduced-motion` non émulable en direct dans ce navigateur (même limite que Phases 2-3, `document.hidden === true`), vérifié par revue de code uniquement.

### 6. QA multi-supports + Lighthouse

- **320px → 1920px** : `scrollWidth === innerWidth` vérifié sur `/`, `/realisations`, une étude de cas, `/contact`, `/services` — 0 scroll horizontal, 0 erreur console sur l'ensemble.
- **Navigateurs** : seul un moteur Chromium est disponible dans cet environnement d'exécution — **Safari (macOS/iOS), Firefox et Android réels n'ont pas pu être testés**. Points à vérifier manuellement en priorité avant mise en production : le `backdrop-filter: blur()` du header (support Safari correct mais à confirmer visuellement), le pin GSAP/ScrollTrigger de la section Chaîne (comportement de scroll parfois différent sur Safari iOS), et Lenis sur Android (interaction tactile).
- **Lighthouse mobile** (`next build` + `next start`, mesure sur le build de production, pas le serveur de dev) :

| Page | Perf | A11y | BP | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | **91** | **98** | **100** | **100** | 3,1 s | 0 |
| `/realisations/ubo-drop` | **93** | **100** | **100** | **100** | 3,1 s | 0 |

  **Tous les scores catégorie dépassent les objectifs** (Perf ≥85, A11y ≥95, BP ≥95, SEO ≥100). **CLS = 0** (objectif <0,1, largement atteint — les dimensions d'image sont bien réservées partout).
  **LCP = 3,1 s, au-dessus de l'objectif <2,5 s.** Diagnostic : le breakdown Lighthouse attribue l'essentiel du dépassement au travail JS du thread principal (~3,2 s simulé sur CPU mobile throttlé — GSAP/Lenis/ScrollTrigger + plusieurs contextes `Reveal` s'initialisant au chargement du Hero), pas à un problème réseau (TTFB 13 ms). **Ce goulot est structurel au système de motion des sections Hero/homepage**, que le périmètre de cette Phase 6 (doc 16-E) interdit explicitement de modifier (« À NE PAS TOUCHER : … hero, motion »). Non corrigé ici par respect du périmètre — recommandation pour une phase dédiée : différer l'initialisation de `ScrollTrigger` pour les sections hors-écran, réduire le nombre de contextes `Reveal` simultanés au premier rendu du Hero, ou lazy-charger `gsap/ScrollTrigger` séparément du cœur `gsap`/`Reveal`.

### 7. Préparation déploiement Vercel

- `.env.example` créé à la racine : `NEXT_PUBLIC_SITE_URL` (documentée, obligatoire pour un `metadataBase` correct en prod) + variables Resend en commentaire (formulaire de contact non encore branché, Phase 3+ future).
- **`npm run build` final : 0 erreur, 0 warning** (le warning `metadataBase` a disparu). `tsc --noEmit` et `npm run lint` : 0 erreur.

#### Procédure de déploiement (à exécuter par l'utilisateur — aucune action déclenchée ici)

1. Fusionner `feat/refonte-immersive` dans `main` (revue humaine recommandée avant fusion — cette branche n'a jamais touché `main` directement, conformément aux garde-fous de toutes les phases).
2. Sur [vercel.com](https://vercel.com), connecter le dépôt GitHub `DamCompany-Site-` (repo déjà existant, doc 00).
3. Vercel détecte automatiquement Next.js (`package.json` à la racine) — aucune configuration de build spécifique nécessaire (`next build` standard).
4. Dans les **Environment Variables** du projet Vercel, définir :
   - `NEXT_PUBLIC_SITE_URL` = URL de production réelle (ex. `https://damcompany.com` une fois le domaine confirmé) — **actuellement inconnue, placeholder dans `.env.example`**.
   - (Plus tard, quand le formulaire de contact sera branché) `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
5. Configurer le domaine personnalisé dans **Settings → Domains** si un domaine autre que `*.vercel.app` est utilisé (DNS à pointer chez le registrar — étape hors de portée de cet outil).
6. Déclencher le déploiement (automatique au push sur `main` une fois le repo connecté, ou déploiement manuel depuis le dashboard Vercel).
7. Après premier déploiement : vérifier `/sitemap.xml`, `/robots.txt`, et soumettre le sitemap dans Google Search Console (nouvelle propriété si le domaine change).

Aucune de ces étapes n'a été exécutée par Claude Code — elles impliquent un compte Vercel, un domaine et potentiellement un paiement, laissés à la décision de l'utilisateur (doc 16-D.7).
