# 01 — Audit du site DamCompany actuel

> Basé sur l'inspection réelle du dépôt (`frontend/` statique + `backend/` Express). Aucune supposition sur la stack : elle a été lue dans les fichiers.

## Stack constatée

- **Frontend :** HTML5 + CSS3 (`css/style.css`, ~725 lignes, variables + responsive commenté) + JavaScript vanilla (`js/main.js`, ~157 lignes). **Aucun framework, aucune dépendance front.**
- **Typographie :** Poppins (Google Fonts) avec repli système.
- **Backend :** Node.js/Express minimal, route `POST /api/contact` (validation basique + réponse JSON), `.env.example`, non bloquant. Optionnel.
- **Assets :** PNG (captures de sites) + logo/favicon SVG recréés.
- **Déploiement :** non configuré (site ouvrable en local ou hébergement statique). Dépôt Git initialisé.

## 7.1 Architecture

- 9 pages : `index` + 7 pages services (`sites-web`, `applications`, `ia`, `data`, `automatisation`, `crm`, `consulting`) + `contact`.
- Navigation claire, header/footer identiques partout, état actif correct par page.
- **Manques :** pas d'étude de cas, pas de page « Réalisations » dédiée (galerie), pas de page « À propos »/fondateur. Parcours essentiellement linéaire, pas de hiérarchie narrative.
- Léger risque de répétition : les 7 pages services suivent le même gabarit (hero + grille + CTA) sans preuve différenciante.

## 7.2 Direction artistique

- **Palette :** crème `#faf7ef`, noir `#141414`, jaune `#ffc83d`, gris texte. Cohérente et premium « clair ».
- **Typo :** une seule famille (Poppins) — efficace mais peu de contraste éditorial (pas de display monumental).
- **Grilles/espacements :** propres (cards arrondies, ombres douces).
- **Médias :** captures PNG de sites, hétérogènes en cadrage/poids, recadrées via `object-fit`. Pas de vidéo, pas de 3D, peu d'iconographie signature.
- **Perception :** « agence sérieuse et soignée ». **Manque de singularité forte** et d'effet « waouh ».

## 7.3 Hero actuel

- Logo « DamC » géant + slogan « Boostez vos performances… sur mesure. » + 2 CTA + 2 cartes flottantes (desktop).
- **Impact 5 s :** l'identité passe, mais l'offre (produits digitaux + IA) n'est pas immédiatement démontrée.
- **Animations :** aucune (statique). Pas de mise en scène, pas d'interaction curseur.
- **Mobile :** cartes flottantes masquées ≤1200px (bon choix anti-chevauchement) ; hero reste lisible.
- **Conclusion :** correct mais **ne prouve pas le niveau technique** de l'agence.

## 7.4 Services

- Bien organisés (7 expertises en grille + 1 page par service). Lisibles.
- **Manques :** pas de séparation forte entre *création digitale* et *IA/Data/Automatisation* ; peu de preuves/exemples rattachés à chaque service ; pas de démonstration interactive.

## 7.5 Projets

- 12 réalisations en cards (image sombre + tag + lien externe `target="_blank"`).
- **Manques :** captures de tailles/qualités inégales, pas de storytelling, pas d'étude de cas, pas d'interaction (hover riche, filtrage, galerie horizontale). Fort potentiel de montée en gamme.

## 7.6 Conversion

- CTA « Contactez-nous » présents ; formulaire contact validé côté client (envoi simulé si pas de backend).
- **Manques / placeholders :** téléphone `+33 6 00 00 00 00`, réseaux en `#`, pas de lien WhatsApp/RDV, pas de références clients ni preuves de confiance (logos, témoignages, chiffres vérifiés).

## 7.7 Technique

- **Qualité code :** propre, lisible, commenté ; JS sans dépendance ; validations OK ; `node --check` OK.
- **Performances :** très légères (pas de framework) ; **point de vigilance :** captures PNG lourdes (plusieurs > 1 Mo) → à compresser/convertir en WebP.
- **Responsive :** grilles 7→4→2→1, burger ≤920px, `overflow-x:hidden`. Bon.
- **Accessibilité :** structure correcte, `aria-label` présents ; à renforcer (focus visibles, navigation clavier du menu, contrastes des textes clairs sur crème).
- **SEO :** `title`/`meta description` uniques + Open Graph par page. Bon socle. Manque : `og:image` en vraie image (actuellement le logo SVG), sitemap, données structurées.
- **Risques de régression :** faibles (statique). La refonte immersive impose une **nouvelle base** (Next.js) → migration à isoler sur branche.

## Synthèse

Base saine, propre et rapide, mais **positionnée comme un site vitrine classique**. Pour devenir la vitrine du niveau créatif/technique de l'agence, il manque : narration, mise en scène animée, études de cas, système de mouvement et différenciation forte. C'est l'objet de la refonte.
