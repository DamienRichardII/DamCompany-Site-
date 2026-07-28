# 02 — Analyse de la référence : landonorris.com

> Objectif : comprendre **les principes** qui rendent ce site exceptionnel, pas les copier. Analyse fondée sur la récupération réelle de la page d'accueil + inspection des URLs d'assets. Le niveau de certitude est explicitement indiqué.

## Niveau de certitude sur la technique

- **Confirmé (observé dans le code/URLs) :**
  - Site hébergé/produit avec **Webflow** (assets servis depuis `cdn.prod.website-files.com`, structure de classes typée Webflow).
  - **Rive** utilisé pour des animations vectorielles interactives (fichiers `…-rive-placeholder.svg`, `footer-rive`, `collabs-rive`).
  - Médias en **WebP** (photos) et **SVG** (logos, signatures, textes monumentaux type `lando-norris-text`).
  - Interaction de **scroll-lock** et hint d'orientation (« Please rotate your device, this is a vertical drive », « tap to lock », « Back to scroll »).
  - **Loader** de marque (« Load Norris »).
- **Probable (comportement typique de ce type de build, non prouvé sans le JS source) :**
  - **GSAP + ScrollTrigger** pour les révélations et le pinning ; **smooth scroll** type Lenis.
  - Galeries **horizontales** pilotées au scroll ; parallaxe ; swaps d'images base/hover (helmets).
- **Non vérifiable sans code source :** existence de WebGL/Three, détails d'orchestration, budget de perf réel.

> Règle appliquée : ne jamais présenter le probable comme certain.

## Structure & narration (observée)

1. **Loader** de marque court.
2. **Header** minimal (logo, Store, menu) + **menu plein écran** avec vignettes images.
3. **Hero** monumental : nom géant, sous-titre rôle, « Next Race », signatures SVG, hint mobile de rotation, interaction « tap to lock ».
4. **Message éditorial** (citation forte) + galerie de moments (photos datées/légendées : « Qatar, 2024 »…).
5. **Deux univers** structurants : **ON TRACK** / **OFF TRACK** (typo monumentale, lien dédié).
6. **Galerie objets** : « Helmets — Hall of Fame » (grille d'objets avec base/hover, année, filtrable visuellement).
7. **Store** (moment de conversion mis en scène).
8. **Partners & Campaigns** (mur de logos animé).
9. **Social wall** (« What's up on socials »).
10. **Footer** immersif (Rive, logos partenaires, slogan « Always bringing the fight »).

**Principe clé :** alternance de **séquences intenses** (hero, univers, galeries) et de **respirations** (citations, espaces vides), chaque section ayant une fonction narrative claire.

## Direction artistique (observée)

- **Contraste clair/sombre** marqué ; **typographies monumentales** (le nom devient élément graphique).
- **Photographie premium** légendée (date + lieu) → transforme des images en récit.
- **Éléments graphiques récurrents** : signature manuscrite lime, logo, « blobs », couleur d'accent (vert lime McLaren).
- **Compositions asymétriques**, superpositions, profondeur, larges espaces négatifs.

## Motion design (observé / probable)

- Loader d'entrée ; révélations de titres au scroll ; parallaxe ; sections **sticky/pin** ; **galeries horizontales** ; swaps hover sur objets ; micro-interactions de liens ; **Rive** pour vecteurs interactifs (footer, collabs).
- Interaction signature : **scroll-lock** (« tap to lock ») qui casse la monotonie du scroll vertical.

## Responsive (observé)

- Adaptations mobiles dédiées (SVG texte « mobile », images horizontales spécifiques).
- Hint **d'orientation** (« vertical drive » / « please rotate ») : le site guide l'utilisateur mobile.

## Performance (contraintes probables)

- Beaucoup de **WebP** + **SVG** (bon pour le poids vs qualité).
- Coût probable : JS d'animation synchronisé au scroll, Rive runtime, nombreuses images → nécessite lazy-loading, préchargement maîtrisé et budget animation.

## Ce qu'on transpose pour DamCompany (principes, pas contenus)

| Principe Lando Norris | Transposition DamCompany |
|---|---|
| Loader de marque | Loader « DamCompany » court (éclair + logo) |
| Nom monumental en hero | Titre monumental **produit/valeur** (« FROM IDEA TO INTELLIGENT PRODUCT ») |
| Deux univers ON/OFF TRACK | Deux univers **BUILD / INTELLIGENCE** |
| Galerie « Helmets » | Galerie **études de cas** (base/hover, secteur, année) |
| Photos légendées datées | Projets légendés (client, secteur, année, techno) |
| Mur de partenaires | Mur **stack technique / clients / logos projets** |
| Social wall | Réalisations récentes / réseaux DamCompany |
| Signature récurrente | Éclair jaune DamCompany comme motif signature |
| Scroll-lock signature | 1 interaction signature sobre (ex : « lock » sur la séquence de fabrication) |

**À ne pas reprendre :** identité F1, vert lime, contenus, textes, structure exacte, animations exactes, éléments Rive propriétaires.
