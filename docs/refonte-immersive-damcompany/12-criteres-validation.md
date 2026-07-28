# 12 — Critères de validation

Critères **observables et vérifiables**. Une étape n'est terminée que si tous les critères applicables sont remplis **et testés**.

## Globaux (toutes phases)
- [ ] `npm run build` réussit, aucun warning bloquant.
- [ ] Aucune erreur **TypeScript** (`tsc --noEmit`).
- [ ] Aucune **erreur console** (chargement + navigation + scroll).
- [ ] Aucun **scroll horizontal** involontaire de 320px à 1920px.
- [ ] **Navigation clavier** complète (menu, liens, formulaire) avec `focus-visible` visible.
- [ ] `prefers-reduced-motion: reduce` : animations coupées/réduites, contenu et sens intacts.
- [ ] Historique **Git** conservé ; travail sur branche `feat/refonte-immersive`.
- [ ] Aucune fonctionnalité existante supprimée sans analyse documentée.

## Phase 2 — Loader / Header / Hero (1re exécution)
- [ ] **Hero lisible à 320px** (titre non tronqué, CTA accessible).
- [ ] **CTA principal visible rapidement** (au-dessus de la ligne de flottaison desktop et mobile).
- [ ] Loader ≤ 2 s et **non bloquant** (contenu accessible même si JS échoue partiellement).
- [ ] Animations **désactivables** (reduced-motion) sans casser la mise en page.
- [ ] Header sticky fonctionnel + menu mobile (ouverture/fermeture/clic lien/échap) avec focus-trap.
- [ ] Desktop **et** mobile livrés et testés.
- [ ] Les médias **ne bloquent pas** l'affichage (lazy, dimensions réservées, pas de CLS notable).

## Contenu & intégrité
- [ ] **Aucun chiffre inventé** ; placeholders explicites `[À_VÉRIFIER]` si non fourni.
- [ ] **Aucun lien fictif** ; liens projets réels en `target="_blank" rel="noopener"`.
- [ ] Formulaire **non présenté comme fonctionnel** s'il ne l'est pas.
- [ ] Aucun contenu parasite (balises visibles, lorem, logs de test).

## Résilience
- [ ] Site **utilisable sans WebGL** (fallback image pour la 3D).
- [ ] Contenu **compréhensible sans animations**.
- [ ] Effets nettoyés lors des changements de page (pas de fuite/jank).

## Performance (Phase 6, objectifs)
- [ ] Lighthouse mobile : Perf ≥ 85, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (objectifs, à mesurer).
- [ ] **CWV** : LCP < 2,5 s, CLS < 0,1, INP < 200 ms (objectifs).
- [ ] Images en WebP/AVIF, lazy, tailles responsives.

## SEO (Phase 6)
- [ ] `title` + `meta description` uniques par route ; OG avec **vraie** image WebP.
- [ ] Redirections **301** des anciennes URLs `.html`.
- [ ] `sitemap.xml` + `robots.txt` présents.
