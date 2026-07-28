# 11 — Risques & préventions

| # | Risque | Impact | Probabilité | Prévention |
|---|---|---|---|---|
| 1 | **Migration big-bang** (tout casser en une fois) | Élevé | Moyenne | Branche dédiée ; `main` intact ; livraison par phases ; validation entre phases |
| 2 | **Copie involontaire** de landonorris.com | Élevé (juridique/image) | Faible | Travailler par principes ; DA/contenus 100 % DamCompany ; pas d'assets/animations repris |
| 3 | **Sur-animation** (jank, fatigue) | Élevé (perf/UX) | Élevée | Budget motion ; 1 lib/fonction ; animer transform/opacity ; QA fps |
| 4 | **Régression SEO** (URLs changées) | Élevé | Moyenne | Redirections 301 ; metas/OG conservés ; sitemap ; comparer avant/après |
| 5 | **Perte de fonctionnalité contact** | Moyen | Faible | Reproduire la validation ; ne pas présenter le form comme fonctionnel s'il ne l'est pas |
| 6 | **Assets manquants / lourds** | Moyen | Élevée | `published:false` si absent ; WebP + `next/image` ; budgets de poids |
| 7 | **Accessibilité dégradée** par l'immersif | Élevé | Moyenne | `prefers-reduced-motion` ; clavier ; focus visibles ; sens jamais porté par le mouvement seul |
| 8 | **Dépendance 3D/WebGL** | Moyen | Moyenne | 3D optionnelle, lazy, fallback image ; site utilisable sans WebGL |
| 9 | **Scroll horizontal involontaire** | Moyen | Moyenne | `overflow-x:hidden` maîtrisé ; tester 320px→1920px ; galerie horizontale = scroll vertical en mobile |
| 10 | **Fuites mémoire animations** entre pages | Moyen | Moyenne | `gsap.context()` + cleanup ; `ScrollTrigger.kill()` au démontage |
| 11 | **Chiffres/témoignages inventés** | Élevé (crédibilité) | Faible | N'afficher que le **vérifié** ; sinon placeholder explicite |
| 12 | **Dépendances superflues** | Moyen | Moyenne | Périmètre de libs figé (doc 08) ; justifier tout ajout |
| 13 | **Dérive de périmètre** (1re exécution trop large) | Élevé | Moyenne | 1re exécution limitée à loader/header/hero ; critères d'arrêt clairs |
| 14 | **Incohérence clair/sombre** | Faible | Moyenne | Tokens sémantiques ; 2 registres définis (doc 06) |
| 15 | **Perte d'historique Git** | Moyen | Faible | Conserver l'historique ; commits atomiques ; pas de force-push destructeur |
