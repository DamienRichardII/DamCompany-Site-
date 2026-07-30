# Journal d'exécution — Refonte immersive DamCompany

> Journal de bord de l'exécution des prompts `13-prompt-execution-claude-code.md` (Phase 0-2)
> et `14-prompt-execution-phase3.md` (Phase 3). Mis à jour au fil de l'exécution, dans l'ordre chronologique.

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
