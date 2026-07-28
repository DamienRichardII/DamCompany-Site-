# 00 — Résumé exécutif

**Projet :** refonte immersive du site vitrine DamCompany
**Référence créative :** landonorris.com (principes, non copie)
**Stack cible retenue :** Next.js (App Router) + React + TypeScript + GSAP/ScrollTrigger + Lenis, Three.js/R3F en option (P2)
**Statut de cette mission :** audit + cadrage + prompt d'exécution. **Aucun fichier fonctionnel du site n'a été modifié** — seul ce dossier `docs/` a été créé.

---

## Ce qui a été fait

1. Inspection réelle du dépôt DamCompany (état confirmé ci-dessous).
2. Analyse factuelle de `landonorris.com` (données observées via récupération de la page + distinction claire entre confirmé / probable / non vérifiable).
3. Matrice comparative priorisée (P0 → P3).
4. Trois concepts créatifs originaux, un recommandé.
5. Arborescence cible, storyboard, direction artistique, système de mouvement.
6. Architecture technique Next.js + plan de migration progressive.
7. Inventaire des assets (disponibles / à améliorer / à produire).
8. Roadmap en 7 phases + risques + critères de validation.
9. **Prompt d'exécution autonome pour Claude Code** (fichier `13-…`).

---

## État réel du dépôt (constaté)

- **Stack actuelle :** site **statique vanilla** — HTML/CSS/JS, **aucun framework**. 9 pages HTML, `css/style.css` (~725 lignes), `js/main.js` (~157 lignes). Backend Express minimal optionnel (`/api/contact`).
- **DA existante :** fond crème `#faf7ef`, noir `#141414`, jaune éclair `#ffc83d`, police Poppins, logo « DamC » recréé en SVG.
- **Contenu :** hero à logo géant + cartes flottantes, 7 expertises, 12 réalisations (cards), bandeau avantages, footer premium, page contact avec formulaire validé côté client.
- **Points forts :** propre, responsive, cohérent, rapide, sans dépendance lourde.
- **Écart principal :** c'est un très bon site vitrine « classique premium », mais **il ne raconte pas d'histoire et ne démontre pas immersivement le niveau technique de l'agence**.

---

## Les 5 écarts les plus importants (vs référence)

1. **Absence de narration / rythme cinématographique (P0).** Le site actuel est une succession de sections statiques ; la référence enchaîne des séquences scénarisées (loader → hero → univers → galeries → CTA) avec respirations.
2. **Hero non démonstratif (P0).** Le hero actuel affiche un grand logo mais ne prouve pas le savoir-faire (pas de mise en scène animée, pas d'interfaces vivantes, pas d'interaction).
3. **Réalisations sous-exploitées (P0).** Cards cliquables uniquement ; aucune **étude de cas** (secteur, besoin, solution, DA, techno, résultats). La référence transforme chaque objet en pièce éditoriale.
4. **Système de mouvement inexistant (P1).** Pas de reveal orchestré, pas de scroll fluide (Lenis), pas de sticky/parallaxe, pas de micro-interactions signature.
5. **Pas de structure « produit digital » différenciante (P1).** L'offre BUILD (création) vs INTELLIGENCE (IA/Data/Automatisation) n'est pas mise en scène comme deux univers lisibles.

*(Détail complet et priorisation dans `03-matrice-comparative.md`.)*

---

## Concept recommandé

**« FROM IDEA TO INTELLIGENT PRODUCT » — le parcours de fabrication.**
Le site devient une chaîne narrative scrollée : *Idée → Stratégie → Design → Développement → Intelligence → Automatisation → Déploiement → Croissance*. Chaque étape est une séquence visuelle, avec deux grands univers reliés (**BUILD** et **INTELLIGENCE**) et une galerie d'études de cas comme preuve.
Pourquoi : c'est cohérent avec l'offre réelle, ça met le savoir-faire en scène (le site EST la démo), et c'est déclinable proprement en desktop/mobile et en version réduite (`prefers-reduced-motion`). *(Alternatives et justification dans `04-concept-creatif-damcompany.md`.)*

---

## Première phase recommandée (à exécuter par Claude Code)

**Phase 0 + Phase 1 + prototype hero uniquement.** Ne pas reconstruire tout le site :
1. vérifier le build, créer une branche `feat/refonte-immersive`, documenter l'état initial ;
2. poser les fondations (design tokens, typo, grille, `prefers-reduced-motion`, Lenis) dans une base Next.js ;
3. livrer **loader + header + hero** en desktop ET mobile, testés ;
4. fournir un compte rendu.

---

## Emplacement du prompt Claude Code

```
docs/refonte-immersive-damcompany/13-prompt-execution-claude-code.md
```

---

## Informations / assets encore manquants (à confirmer, non inventés)

- **URL de production** du site DamCompany actuel : *inconnue* (placeholder `[URL_PROD]`). Dépôt connu : `https://github.com/DamienRichardII/DamCompany-Site-`.
- **Chiffres clés** (nb de projets, résultats clients) : *non vérifiés* → placeholders, à fournir par le client.
- **Coordonnées réelles** (téléphone, e-mail pro, réseaux) : le site utilise des placeholders.
- **Assets projets manquants** (pas d'image dans le dépôt) : Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100. *(Détail dans `09-inventaire-assets.md`.)*
- **Textes d'études de cas** et **portraits équipe/fondateur** : à produire.
- **Choix langue** (FR / EN / bilingue) : à trancher (le hero de référence est en EN).
