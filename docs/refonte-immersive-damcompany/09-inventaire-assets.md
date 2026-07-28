# 09 — Inventaire des assets

Cibles de format : **WebP/AVIF** pour les images, **SVG** pour logos/traits, **GLB/GLTF** (Draco) pour la 3D, **WebM/MP4 (H.264)** pour la vidéo.

## Assets déjà disponibles (dans le dépôt)

| Asset | Fichier | Usage | Remarque |
|---|---|---|---|
| Logo DamCompany | `frontend/assets/logo.svg` | header/footer/OG | recréé, propre, vectoriel |
| Favicon | `frontend/assets/favicon.svg` | onglet | OK |
| UBO-DROP (site) | `Ubodrop-site.png` | projet/étude de cas | à convertir WebP |
| UBODROP App | `Ubodrop-Applications.png` | projet | à convertir WebP |
| MA1 (site) | `MA1-site.png` | projet | idem |
| MA1 IA | `MA1-IA.png` | projet IA | idem |
| Reset SMP | `reset-smp-site.png` | projet | lourd → compресser |
| Africa2kball | `Africa2kball-site.png` | projet | lourd → compresser |
| Nad Motivation | `Nad-motivation-site.png` | projet | lourd → compresser |
| I Can Play | `ICP-site.png` | projet | à convertir |
| One One Arena | `1x1-Arena-site.png` | projet | à convertir |
| KingBrel | `Kingbrel-site.png` | projet | à convertir |
| Divan Grill | `Divan-Grill-site.png` | projet | à convertir |
| Peace of Mind Signature | `Peaceofmind-site.png` | projet | petite résolution → à améliorer |
| Portfolios | `Damien-Portfolio.png`, `Sandrine-Portfolio.png` | à-propos/équipe ? | usage à confirmer |
| Fly Future Champions | `Fly-future-champions-site.png` | projet non listé | usage à confirmer |

## Assets à améliorer

| Problème | Assets concernés | Action |
|---|---|---|
| PNG lourds (> 1 Mo) | Ubodrop-site, Africa2kball, reset-smp, Nad-motivation, Divan-Grill | Convertir WebP/AVIF, recompresser, tailles responsives |
| Captures hétérogènes | ensemble des projets | Recadrage homogène (ratio unique) + mockup device |
| Résolution faible | Peaceofmind-site | Refaire capture HD |
| `og:image` | global | Produire une vraie image de partage WebP 1200×630 |

## Assets à produire

| Asset | Format | Dimensions | Poids max | Emplacement | Rôle | Obligatoire ? |
|---|---|---|---|---|---|---|
| Logo animé (loader) | SVG/Lottie/Rive | vectoriel | < 60 Ko | `public/brand/` | loader | Oui |
| Mockups desktop | WebP | 1600×1000 | < 250 Ko | `public/media/projects/` | galerie/études de cas | Oui |
| Mockups mobile | WebP | 800×1600 | < 200 Ko | idem | études de cas | Oui |
| Images étapes « chaîne » (×8) | SVG/WebP | ~1200px | < 150 Ko | `public/media/chain/` | section chaîne | Oui |
| OG image | WebP | 1200×630 | < 200 Ko | `public/brand/` | partage social | Oui |
| Portrait fondateur / équipe | WebP | 1200×1500 | < 250 Ko | `public/media/team/` | section humaine | Recommandé |
| Objet 3D hero | GLB (Draco) | — | < 1,5 Mo | `public/3d/` | hero premium | Option (P2) |
| Vidéos démo d'interfaces | WebM/MP4 | 1080p | < 3 Mo/clip | `public/media/video/` | études de cas | Option |
| Icônes services (set) | SVG | 24px | — | `public/icons/` | services | Recommandé |
| Textures / halos | WebP/SVG | — | léger | `public/media/tex/` | ambiance | Option |
| Logos clients / partenaires | SVG | — | — | `public/media/logos/` | preuve/confiance | Si autorisation |

## Projets cités sans asset disponible (à produire ou dépublier)

**Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100** — aucune image dans le dépôt.
→ Marquer `published: false` tant que l'asset et l'accord client manquent. Ne rien inventer (pas de faux visuel, pas de faux résultat).

## Contenus textes / données à fournir (non inventés)

- Textes d'**études de cas** (contexte, besoin, solution, techno) par projet.
- **Chiffres clés vérifiés** (sinon placeholders explicites `[À_VÉRIFIER]`).
- **Témoignages réels** + autorisations logos clients.
- **Coordonnées réelles** (téléphone, e-mail pro, réseaux, lien RDV/WhatsApp).
- Choix de **langue** (FR / EN / bilingue).
