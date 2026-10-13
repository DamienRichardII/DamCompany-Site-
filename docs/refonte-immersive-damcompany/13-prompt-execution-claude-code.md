# 13 — Prompt d'exécution pour Claude Code

> Copier tout le bloc ci-dessous dans Claude Code, à la racine du dépôt DamCompany.
> Ce prompt est **autonome**. Il ne demande PAS de tout reconstruire : la première exécution se limite aux **fondations + loader + header + hero (desktop & mobile)**.

---

```text
MISSION — REFONTE IMMERSIVE DAMCOMPANY (Phase 0 → 1 → 2 uniquement)

Lis d'abord : docs/refonte-immersive-damcompany/ (00 à 12) et Damcompany-code-guardrails.md.
Respecte strictement les guardrails : modification chirurgicale, zéro régression, aucune refonte non demandée, aucune dépendance non justifiée.

────────────────────────────────────────
A. TON RÔLE
────────────────────────────────────────
Tu es lead developer + creative developer, expert de la stack réellement détectée dans ce dépôt puis de la stack cible Next.js. Tu es garant : de la performance, du responsive mobile-first, de l'accessibilité, des tests et de la documentation. Tu ne considères aucune étape « terminée » sans l'avoir testée.

────────────────────────────────────────
B. CONTEXTE RÉEL DU DÉPÔT (à vérifier toi-même avant d'agir)
────────────────────────────────────────
- Stack actuelle CONSTATÉE : site statique vanilla — HTML/CSS/JS, AUCUN framework.
  • frontend/ : index.html + 7 pages services + contact.html ; css/style.css (~725 l.) ; js/main.js (~157 l.)
  • backend/ : Express minimal, route POST /api/contact (validation + JSON), optionnel.
  • assets/ + frontend/assets/ : logo.svg, favicon.svg, captures PNG de projets (certaines > 1 Mo).
- Identité : crème #faf7ef, noir #141414, jaune éclair #ffc83d, police Poppins.
- Git : dépôt initialisé (remote GitHub existant). Historique à conserver.
COMMENCE PAR : inspecter package.json (racine si présent + backend/), l'arborescence, et confirmer la stack. Ne suppose rien : vérifie.

────────────────────────────────────────
C. OBJECTIF DE LA REFONTE (vision)
────────────────────────────────────────
Transformer le site vitrine en expérience immersive premium qui DÉMONTRE le niveau de l'agence.
- Positionnement : agence Tech & digitale — création (BUILD) ET intelligence (IA/Data/Automatisation).
- Concept retenu : « FROM IDEA TO INTELLIGENT PRODUCT » — une chaîne de fabrication scrollée
  (Idée → Stratégie → Design → Développement → Intelligence → Automatisation → Déploiement → Croissance),
  deux univers reliés BUILD / INTELLIGENCE, galerie d'études de cas comme preuve.
- Inspiration = PRINCIPES de landonorris.com (narration, typo monumentale, rythme, motion maîtrisé).
  INTERDIT : copier son identité F1, ses contenus, sa structure exacte, ses animations, ses assets.
- Signature visuelle DamCompany : l'ÉCLAIR jaune comme motif récurrent.
Détails : docs 04 (concept), 05 (storyboard), 06 (DA/tokens), 07 (motion).

────────────────────────────────────────
D. STACK CIBLE (périmètre de dépendances AUTORISÉ — n'ajoute rien d'autre sans justification)
────────────────────────────────────────
Next.js (App Router) + React + TypeScript (strict) · CSS Modules + variables (tokens) ·
Lenis (smooth scroll) · GSAP + ScrollTrigger (orchestration) · Framer Motion (micro-interactions ponctuelles UNIQUEMENT) ·
next/image · next/font. 3D (Three.js/React-Three-Fiber) = PLUS TARD (P2), NE PAS l'installer maintenant.
Une seule librairie par fonction. Pas de Tailwind requis (optionnel, à ne pas ajouter sauf accord).

────────────────────────────────────────
E. PÉRIMÈTRE DE CETTE PREMIÈRE EXÉCUTION (NE PAS DÉPASSER)
────────────────────────────────────────
1. Vérifier que le projet actuel fonctionne (build/ouverture) et le documenter.
2. Créer une branche dédiée : feat/refonte-immersive. NE PAS toucher à main. NE PAS supprimer le site statique.
3. Documenter l'état initial (perfs/captures) dans docs/refonte-immersive-damcompany/_journal.md.
4. Initialiser la base Next.js + TypeScript SANS détruire l'existant (voir F).
5. Créer/renforcer le DESIGN SYSTEM : styles/tokens.css (couleurs, typo, espacements de la doc 06), next/font, grille.
6. Mettre en place le système de mouvement de base : LenisProvider + setup GSAP + hook useReducedMotion.
7. Construire le PROTOTYPE : Loader + Header (+ menu mobile) + Hero + 1 transition/respiration.
8. Livrer une version DESKTOP et MOBILE testées ; implémenter prefers-reduced-motion.
9. Tester (voir H) et fournir le compte rendu (voir I).
STOP après le hero. NE construis PAS les sections chaîne/services/galerie/etc. dans cette exécution.

────────────────────────────────────────
F. PLAN DE FICHIERS
────────────────────────────────────────
Choix d'intégration Next.js (à décider et documenter) : soit initialiser Next.js à la RACINE en déplaçant
le site statique actuel dans /legacy-static/ (conservé, non supprimé), soit dans un sous-dossier /web/.
Recommandation : /legacy-static/ pour l'ancien + Next.js à la racine. Documente ton choix dans _journal.md.

À CRÉER (cette exécution) :
- app/layout.tsx (fonts, providers, métadonnées SEO de base)
- app/page.tsx (accueil : loader + header + hero + 1 respiration ; sections suivantes = placeholders vides commentés)
- app/globals.css ; styles/tokens.css
- components/layout/Header.tsx, MobileNav.tsx, Footer.tsx (Footer minimal), Loader.tsx
- components/motion/LenisProvider.tsx, Reveal.tsx, useReducedMotion.ts, Bolt.tsx (effets éclair réutilisables : tracé, glow, transitions)
- components/sections/Hero.tsx
- components/ui/Button.tsx, Eyebrow.tsx
- lib/seo.ts ; next.config.js ; tsconfig.json ; .env.example
- public/brand/ (reprendre logo.svg, favicon.svg existants)

À CONSERVER : tout le dossier statique (déplacé en /legacy-static/), les assets, l'historique Git.
À REFACTORISER : rien d'autre pour l'instant.
À SUPPRIMER : rien (aucune suppression sans justification écrite).

────────────────────────────────────────
G. INSTRUCTIONS VISUELLES (doc 06 pour le détail)
────────────────────────────────────────
- Couleurs (tokens) : crème #faf7ef / #fffdf8, noir #141414 / #0d0d0d, jaune #ffc83d / #ffd873, texte #1c1c1c / muted #6b6b6b / invert #f4f4f4.
- Deux registres : CLAIR (base) et CINÉMATIQUE sombre (hero moments/univers). Tokens sémantiques.
- Typo : ajouter une DISPLAY forte self-hostée (Clash Display / Space Grotesk / Satoshi — vérifier licence) + Poppins conservé pour le texte. Échelle fluide clamp (hero clamp(2.75rem,8vw,8rem)).
- Grille 12 col, gouttière 24px, conteneur 1240–1440px, compositions asymétriques SANS scroll horizontal.
- Motif signature : éclair jaune (trait/halo/séparateur).
- ★ ACCENT PRIORITAIRE — ANIMATIONS & TRANSITIONS « ÉCLAIR » : l'éclair jaune est le FIL CONDUCTEUR animé du site, pas un simple ornement statique. Mettre l'accent dessus dans le motion :
  • Loader : l'éclair se trace/s'illumine (path SVG stroke-dashoffset ou glow) avant de révéler le logo, puis « décharge » dans la page pour lancer le hero.
  • Hero : éclair(s) subtils qui pulsent/scintillent (glow, léger flicker) et réagissent au curseur (parallaxe/aimantation), sans jamais gêner la lecture du titre.
  • Transitions de section / d'univers (BUILD → INTELLIGENCE) : un éclair parcourt/relie les sections comme un « signal » (trait animé au scroll) ; il sert de transition entre les registres clair et cinématique sombre.
  • Micro-interactions : au hover/focus des CTA et liens, un mini-éclair ou un halo jaune se déclenche ; puces/séparateurs = petits éclairs animés à l'apparition.
  • Reveals : accents lumineux jaunes (sweep/glow) accompagnant l'arrivée des titres.
  Techniquement : animer via SVG (stroke-dashoffset, opacity) + GSAP, sur transform/opacity uniquement, GPU-friendly. Rester ÉLÉGANT et sobre (premium, pas clignotant) : intensités réduites en mobile, et TOUT l'effet éclair est coupé/réduit si prefers-reduced-motion (le sens ne dépend jamais de l'éclair). Prévoir un composant réutilisable (ex. components/motion/Bolt.tsx) centralisant ces effets.
- États obligatoires hover / focus-visible / active pour tout élément interactif ; anneau focus 2px accent.
- Hero : titre monumental « FROM IDEA TO INTELLIGENT PRODUCT » (ou variante bilingue à confirmer),
  sous-titre de valeur, CTA principal (Contact/Projet) + CTA secondaire (Réalisations),
  interfaces/mockups vivants (images existantes en attendant de vrais mockups), léger parallaxe curseur (desktop, dégradable).
- Aucune information/action essentielle portée uniquement par le hover.

────────────────────────────────────────
H. INSTRUCTIONS TECHNIQUES
────────────────────────────────────────
- TypeScript strict, pas de any injustifié, pas de @ts-ignore masquant, pas de désactivation d'ESLint pour cacher une erreur.
- Server Components par défaut ; 'use client' seulement pour l'interactif (motion, form, menu).
- Animations : animer transform/opacity uniquement ; gsap.context() + cleanup au démontage ; ScrollTrigger.update synchronisé à Lenis ; tout neutralisé si prefers-reduced-motion.
- Médias : next/image (WebP/AVIF, lazy, dimensions réservées → pas de CLS). Ne bloque jamais l'affichage.
- Le contenu doit rester visible et compréhensible même si le JS d'animation échoue.
- Responsive mobile-first ; tester 320 → 1920 ; overflow-x maîtrisé.
- SEO : generateMetadata (title/description/OG). Pas encore de migration SEO complète (Phase 6).
- Contact : NE PAS présenter le formulaire comme fonctionnel s'il ne l'est pas (Phase 3+).
- Gestion des erreurs : pas d'erreur console ; états de chargement propres.
- Tests : voir critères doc 12.

────────────────────────────────────────
I. CRITÈRES D'ACCEPTATION (observables — cette exécution)
────────────────────────────────────────
- npm run build réussit ; tsc --noEmit sans erreur ; 0 erreur console.
- Branche feat/refonte-immersive créée ; main intact ; historique Git conservé.
- Design tokens en place et appliqués ; display + Poppins chargées via next/font.
- Loader ≤ 2 s non bloquant ; Header sticky + menu mobile (ouverture/fermeture/clic lien/échap, focus-trap).
- Hero lisible à 320px, titre non tronqué, CTA principal visible rapidement (desktop + mobile).
- Animations désactivables via prefers-reduced-motion sans casser la mise en page.
- Aucun scroll horizontal de 320 à 1920px ; pas de CLS notable ; médias en lazy.
- Site utilisable même sans les animations ; aucun contenu inventé (chiffres/liens) ; placeholders explicites si donnée absente.
- _journal.md documente : choix d'intégration, état initial, décisions.

────────────────────────────────────────
J. INFORMATIONS INCONNUES — NE PAS INVENTER
────────────────────────────────────────
- URL de production : inconnue → placeholder [URL_PROD].
- Chiffres clés / résultats clients : non fournis → [À_VÉRIFIER], ne rien afficher de faux.
- Coordonnées réelles (téléphone/e-mail/réseaux) : placeholders actuels → garder tels quels, signaler.
- Langue du site (FR/EN/bilingue) : à confirmer → défaut proposé, signaler le choix dans le rapport.
- Assets projets manquants (Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100) :
  ne pas fabriquer de visuel/résultat ; marquer published:false quand ces projets seront intégrés (Phase 4).
Pour chaque inconnue : utiliser un placeholder explicite et indiquer dans le rapport comment la vérifier.

────────────────────────────────────────
K. FORMAT DU RAPPORT FINAL (obligatoire)
────────────────────────────────────────
Fournir en fin d'exécution :
1. Résumé des changements.
2. Fichiers créés.
3. Fichiers modifiés.
4. Dépendances ajoutées (+ justification, dans le périmètre D).
5. Commandes exécutées.
6. Tests réalisés + résultats (build, tsc, console, 320px, clavier, reduced-motion).
7. Limites / ce qui n'est pas fait (normal : sections post-hero).
8. Assets/infos manquants (rappel section J).
9. Prochaine étape recommandée (Phase 3 — homepage complète).

CONTRAINTES FINALES : ne copie pas un autre site ; ne refais pas tout en une exécution ; n'installe pas toutes les libs possibles ; ne fabrique pas d'assets absents ; ne masque aucun problème ; ne déclare rien « terminé » sans test.
```

---

## Notes d'usage (hors bloc)

- Ce prompt couvre **la première exécution** (Phases 0–2). Pour les phases suivantes, réutiliser la même structure en changeant la section **E (périmètre)** et **I (critères)** selon la doc `10-roadmap-execution.md` — une phase par exécution, testée avant de continuer.
- Avant de lancer : renseigner les **placeholders** connus (langue, coordonnées, URL prod) si disponibles, pour éviter que Claude Code s'arrête dessus.
- Rappeler à Claude Code de lire `Damcompany-code-guardrails.md` (déjà à la racine du dépôt).
