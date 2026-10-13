# 07 — Motion design system

Un **système** cohérent, pas une accumulation d'effets. Une seule lib par fonction : **GSAP + ScrollTrigger** (orchestration/scroll), **Lenis** (smooth scroll), **Framer Motion** uniquement pour micro-interactions React ponctuelles. Pas de doublon.

## Principes directeurs

1. Chaque animation a un **objectif narratif** (sinon elle est supprimée).
2. **Accessibilité d'abord :** tout respecte `prefers-reduced-motion: reduce` → animations coupées ou réduites à un fondu court ; le sens ne dépend jamais du mouvement.
3. **Performance :** animer `transform`/`opacity` uniquement ; `will-change` ciblé ; nettoyage (`ScrollTrigger.kill()`, `ctx.revert()`) au démontage / changement de page.
4. **Mobile :** intensités réduites, pas de parallaxe coûteuse, pas d'effets hover essentiels.
5. **Budget :** viser 60 fps ; pas plus d'1 effet lourd simultané par vue.

## Tokens de mouvement

```
Durées :  xfast 120ms · fast 240ms · base 400ms · slow 700ms · cine 1000ms
Ease :    standard cubic-bezier(.4,0,.2,1) · entrance (.16,1,.3,1) · exit (.7,0,.84,0)
Décalage (stagger) : 60–90ms
Distance reveal : 16–24px (desktop), 8–12px (mobile)
```

## Catalogue (par animation)

| Animation | Objectif | Déclencheur | Durée | Intensité | Desktop | Mobile | Reduced-motion | Perf |
|---|---|---|---|---|---|---|---|---|
| **Loader** | Entrée de marque | Chargement | ≤ 2 s | Moyenne | Éclair + logo | Idem plus court | Skip → contenu direct | Précharger 1er écran |
| **Reveal titres** | Hiérarchie | Scroll (in view) | base | Faible | transl/opacity + split | opacity seul | Fondu 120ms | GPU only |
| **Parallaxe** | Profondeur | Scroll | — | Faible | oui (léger) | non | off | transform only |
| **Smooth scroll (Lenis)** | Fluidité | Global | — | — | oui | oui (léger) | off (scroll natif) | rAF unique |
| **Sections sticky/pin** | Séquencer la chaîne | Scroll | — | Moyenne | pin étapes | pin réduit ou natif | pas de pin | éviter layout thrash |
| **Galerie horizontale** | Parcours projets | Scroll | slow | Moyenne | scroll→translateX | scroll vertical natif | statique | virtualiser si long |
| **Transition clair→sombre** | Passage d'univers | Scroll | cine | Moyenne | fond animé | fond animé court | bascule instantanée | background/opacity |
| **Transitions de page** | Continuité | Navigation | base | Faible | fondu/masque | fondu court | fondu instantané | nettoyer anciennes tweens |
| **Compteurs stats** | Crédibilité | In view | slow | Faible | count-up | count-up | valeur finale directe | 1 rAF |
| **Boutons magnétiques** | Micro-signature | Hover (desktop) | fast | Faible | oui | désactivé | désactivé | pointer only |
| **Menu plein écran** | Navigation | Clic | base | Moyenne | overlay + stagger | overlay | fondu simple | focus-trap |
| **Objet 3D hero (option P2)** | Effet premium | In view | — | Moyenne | R3F léger | image/vidéo fallback | image statique | lazy + dégradable |
| **Footer (motif éclair)** | Sortie de marque | In view | base | Faible | trait animé | statique | statique | SVG léger |

## Règles d'implémentation

- Un **provider** unique initialise Lenis + synchronise `ScrollTrigger` (`lenis.on('scroll', ScrollTrigger.update)`).
- Utiliser `gsap.context()` par composant + cleanup dans le `useEffect` de retour.
- Respecter `prefers-reduced-motion` via un **hook** central (`useReducedMotion`) qui neutralise les timelines.
- Aucune animation ne bloque l'affichage du contenu (contenu visible même si JS échoue).
- Pas de scroll horizontal involontaire : la galerie horizontale se convertit en scroll vertical en mobile.

## Anti-patterns interdits

- Cumuler GSAP **et** Framer Motion pour la même chose.
- Animer `width`/`height`/`top`/`left` (préférer `transform`).
- Effets hover portant une info essentielle.
- Timelines non nettoyées entre pages (fuite mémoire / jank).
