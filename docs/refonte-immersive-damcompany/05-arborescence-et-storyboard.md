# 05 — Arborescence & storyboard

## Arborescence cible (navigation resserrée)

```text
/                      Accueil immersif (le fil de fabrication)
/realisations          Galerie d'études de cas (grille filtrable)
/realisations/[slug]   Étude de cas (modèle unique, contenu CMS)
/services              Vue d'ensemble des 2 univers
  /services/build          BUILD : sites, e-commerce, réservation, location, apps, plateformes
  /services/intelligence   INTELLIGENCE : IA, chatbots, automatisation, CRM, Data, reporting
/a-propos              Vision, méthode, fondateur/équipe
/contact               Conversion (form + RDV/WhatsApp/e-mail)
```

**Principes :** navigation mémorisable (6 entrées max), pas de multiplication de pages. Les 7 anciennes pages services sont **regroupées** en 2 univers + détails. Les anciennes URLs sont **redirigées** (301) pour préserver le SEO. La galerie remplace la simple liste de cards.

> Décision à valider : conserver ou non des pages service individuelles (SEO longue traîne). Recommandation : garder `build` et `intelligence` comme hubs, et traiter chaque sous-service en **section ancrée** + éventuelle page seulement si demande SEO réelle.

## Storyboard — page d'accueil (séquence scrollée)

| # | Section | Rôle narratif | Contenu | Motion (résumé) |
|---|---|---|---|---|
| 0 | **Loader** | Entrée de marque | Éclair + logo DamCompany | Apparition < 2 s, sortie fluide |
| 1 | **Header** | Repère constant | Logo, nav, CTA | Sticky, condensation au scroll |
| 2 | **Hero** | Promesse + preuve | Titre monumental « FROM IDEA TO INTELLIGENT PRODUCT », sous-titre valeur, CTA principal + secondaire, interfaces/mockups vivants | Reveal titre, léger parallaxe curseur, objet 3D optionnel |
| 3 | **Vision** | Respiration | Phrase forte sur la mission DamCompany | Fondu / texte cinétique sobre |
| 4 | **La chaîne** | Cœur du concept | 8 étapes : Idée→…→Croissance | Sticky + progression, éclair reliant |
| 5 | **BUILD** | Univers 1 | Création digitale : sites, apps, plateformes + exemples | Entrée d'univers (fond, titre monumental) |
| 6 | **INTELLIGENCE** | Univers 2 | IA, Data, automatisation, CRM + exemples | Transition d'univers (clair→sombre) |
| 7 | **Galerie projets** | Preuve | Études de cas (base/hover, secteur, année) | Galerie + hover riche, lien détail |
| 8 | **Chiffres clés** | Crédibilité | Stats **vérifiées** (placeholder sinon) | Compteurs animés (au scroll) |
| 9 | **Processus** | Méthode | Comment on travaille | Steps révélés |
| 10 | **Fondateur / équipe** | Humain | Portrait + mots | Portrait + citation |
| 11 | **Références / témoignages** | Confiance | Logos + verbatims **réels** | Mur animé sobre |
| 12 | **CTA conversion** | Action | « Parlons de votre projet » + RDV/WhatsApp/e-mail | Bouton magnétique |
| 13 | **Footer** | Sortie | Nav, réseaux, mention, éclair | Rappel de marque, motif éclair |

## Storyboard — étude de cas `/realisations/[slug]`

Hero projet (visuel plein + titre + secteur/année) → Contexte & besoin → Solution → Fonctionnalités → Direction artistique → Technologies → **Interfaces desktop & mobile** → Résultats (**vérifiés uniquement**) → Lien vers le site → Projets suivants (navigation entre réalisations).

## Version « réduite » (accessibilité / appareils faibles)

Même contenu, sans animations lourdes : la **chaîne** reste une liste ordonnée lisible, la galerie une grille statique, les compteurs affichent la valeur finale. Aucune information n'est portée uniquement par l'animation ou le hover.
