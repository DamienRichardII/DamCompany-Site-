# Journal d'exécution — Refonte immersive DamCompany

> Journal de bord de l'exécution du prompt `13-prompt-execution-claude-code.md`.
> Mis à jour au fil de l'exécution, dans l'ordre chronologique.

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
