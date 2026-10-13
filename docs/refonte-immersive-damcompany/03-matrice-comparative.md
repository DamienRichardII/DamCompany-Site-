# 03 — Matrice comparative DamCompany / Lando Norris

Priorités : **P0** indispensable · **P1** important · **P2** amélioration · **P3** expérimentation.

| Critère | DamCompany actuel | Lando Norris (réf.) | Écart | Recommandation DamCompany | Prio |
|---|---|---|---|---|---|
| Première impression | Logo géant statique, propre | Loader + hero monumental scénarisé | Fort | Loader court + hero animé démonstratif | **P0** |
| Loader | Aucun | Loader de marque | Fort | Loader DamCompany (éclair + logo), < 2 s | P1 |
| Navigation | Header classique + burger | Header minimal + menu plein écran imagé | Moyen | Menu plein écran immersif, sobre | P1 |
| Hero | Logo + slogan + 2 CTA, statique | Nom monumental + interaction + médias | Fort | Titre monumental + interfaces vivantes + interaction curseur | **P0** |
| Storytelling | Sections juxtaposées | Récit rythmé, respirations | Fort | Fil narratif « Idée → Produit intelligent » | **P0** |
| Direction artistique | Crème/noir/jaune, Poppins | Contraste clair/sombre, typo monumentale | Moyen | Ajouter mode cinématique sombre + display monumental | P1 |
| Typographie | 1 famille (Poppins) | Display + éditorial | Moyen | Ajouter une **display** forte + échelle monumentale | P1 |
| Qualité des médias | PNG hétérogènes, lourds | WebP/SVG maîtrisés, légendés | Fort | WebP, mockups homogènes, légendes (client/secteur/année) | **P0** |
| Animations | Aucune | Reveal, parallaxe, sticky, Rive | Fort | Système GSAP + Lenis cohérent | P1 |
| Rythme de page | Plat | Intense/respiration alterné | Fort | Séquences + respirations | P1 |
| Présentation services | Grilles claires | Univers mis en scène | Moyen | 2 univers **BUILD / INTELLIGENCE** interactifs | P1 |
| Présentation projets | Cards liens | Galerie objets premium | Fort | Galerie immersive + hover riche | **P0** |
| Études de cas | Absentes | Récits par objet | Fort | Modèle d'étude de cas (secteur/besoin/solution/techno/résultats) | **P0** |
| Interaction | Basique (hover) | Curseur, lock, micro-interactions | Fort | Micro-interactions signature + curseur (non essentielles au sens) | P2 |
| 3D / WebGL | Aucune | Vecteurs Rive (3D non prouvée) | Moyen | Élément 3D léger (hero) en option, dégradable | P2 |
| Responsive | Bon (grilles, burger) | Adaptations mobiles dédiées | Faible | Conserver + hero mobile scénarisé | P1 |
| Performance | Légère mais PNG lourds | Lourd mais optimisé | Moyen | Budget perf + WebP + lazy + code-split animations | **P0** |
| Accessibilité | Correcte, à renforcer | Non audité | — | Focus visibles, clavier, `prefers-reduced-motion` | **P0** |
| SEO | Bon socle (meta/OG) | Fort (marque) | Faible | Conserver + sitemap + data structurée + vrai `og:image` | P1 |
| Conversion | CTA + form (placeholders) | Conversion scénarisée (Store) | Moyen | Preuves de confiance + CTA scénarisé + RDV/WhatsApp | P1 |
| Différenciation | Moyenne | Très forte | Fort | Site = démo du savoir-faire | **P0** |
| Maintenabilité | Simple (statique) | CMS Webflow | — | Next.js + CMS études de cas (Sanity/Supabase) | P1 |

## Regroupement des P0 (à traiter en priorité)

1. Hero démonstratif + première impression (loader).
2. Narration / storytelling structurant.
3. Galerie projets + **études de cas** (avec médias homogènes WebP légendés).
4. Performance (budget + WebP + lazy) et accessibilité (`prefers-reduced-motion`, clavier, focus).
5. Différenciation : faire du site la preuve directe du niveau de l'agence.
