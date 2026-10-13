# 17 — Prompt d'exécution Claude Code — PHASE 6b (Optimisation LCP)

> Correctif ciblé du seul objectif chiffré non atteint en Phase 6 : **LCP 3,1 s → objectif < 2,5 s**.
> Cette phase AUTORISE explicitement à toucher Hero + système de motion, mais INTERDIT toute modification du rendu visuel perçu.

---

```text
MISSION — REFONTE IMMERSIVE DAMCOMPANY · PHASE 6b (LCP)

Lis d'abord : docs/refonte-immersive-damcompany/ (07 motion, 12 critères, 16 Phase 6, _journal.md) + Damcompany-code-guardrails.md.
Objectif unique : réduire le LCP mobile sous 2,5 s SANS changer l'apparence ni l'animation perçue du site.

────────────────────────────────────────
A. DIAGNOSTIC (déjà établi — à confirmer par mesure)
────────────────────────────────────────
- LCP mesuré ≈ 3,1 s (Lighthouse mobile, build prod). CLS = 0. Perf 91-93.
- Cause identifiée : l'élément LCP (titre du Hero) est rendu via <Reveal> qui applique opacity:0 + translateY jusqu'à l'exécution de GSAP. Le contenu above-the-fold n'est donc pas peint au premier rendu → LCP dépend du JS de motion (GSAP/Lenis/ScrollTrigger + plusieurs Reveal simultanés au chargement).
COMMENCE PAR : confirmer via un profil Lighthouse quel nœud est le LCP (probablement le <h1> du Hero ou l'image mockup priority), avant de corriger.

────────────────────────────────────────
B. PRINCIPE DE CORRECTION (ne pas dégrader le visuel)
────────────────────────────────────────
Le contenu critique (above-the-fold) doit être PEINT immédiatement au premier rendu ; l'animation devient une amélioration progressive, pas un prérequis d'affichage.
Approches autorisées (choisir la plus simple qui atteint la cible) :
1. Ne plus masquer l'élément LCP via JS : le <h1> du Hero (et le contenu above-the-fold) doit être visible dès le HTML/CSS initial. Si un reveal est conservé, l'implémenter en CSS (animation qui part d'un état DÉJÀ peint/visible pour le LCP, ex. transform léger sans opacity:0 sur le nœud LCP), ou n'animer que des enfants non-LCP.
2. Variante "above-the-fold" de Reveal : un mode (prop) qui, pour les blocs du hero, joue l'anim SANS opacity:0 de départ (ou avec un délai nul et un état initial visible), afin de ne jamais retarder le paint. Les Reveal plus bas dans la page gardent le comportement actuel.
3. Différer l'initialisation du motion non critique : n'initialiser Lenis/ScrollTrigger et les Reveal hors-écran qu'après le premier paint (requestIdleCallback / après 'load' / dynamic import), pour libérer le thread au moment du LCP. Le parallaxe curseur du Hero peut s'attacher après interaction/idle.
4. Vérifier que l'image LCP éventuelle (mockup) est bien priority + fetchpriority="high" + sizes correct, et qu'aucune animation ne la retient masquée.

INTERDIT : changer la typo, la taille, la couleur, la composition, la durée/allure perçue des animations une fois jouées. L'utilisateur ne doit voir AUCUNE différence visuelle, seulement un affichage plus rapide.

────────────────────────────────────────
C. PÉRIMÈTRE
────────────────────────────────────────
Autorisé à modifier : components/sections/Hero.tsx (+CSS), components/motion/Reveal.tsx, components/motion/LenisProvider.tsx, components/layout/Loader.tsx si le loader retarde le paint, app/page.tsx (ordre/props above-the-fold).
NE PAS toucher : la DA (tokens), le contenu, content/projects.ts, les sections sous le hero (sauf init différée globale), les pages Réalisations/Contact, les redirections/SEO de la Phase 6.
NE PAS ajouter de dépendance. NE PAS introduire de 3D.

────────────────────────────────────────
D. CONTRAINTES TRANSVERSES (conserver)
────────────────────────────────────────
- prefers-reduced-motion : toujours respecté (déjà le cas). En reduced-motion, le contenu reste visible immédiatement (c'est déjà l'esprit).
- Aucune régression : loader, hero, reveals, pin de la chaîne, transitions d'univers doivent fonctionner comme avant APRÈS le premier paint.
- 0 CLS : ne pas réintroduire de décalage (réserver les dimensions ; ne pas remplacer opacity par un layout shift).
- 0 erreur console ; build/tsc/lint OK.

────────────────────────────────────────
E. CRITÈRES D'ACCEPTATION (mesurables)
────────────────────────────────────────
- LCP mobile (Lighthouse, build prod) < 2,5 s sur / — mesure avant/après fournie.
- CLS reste 0 ; Perf ≥ 91 (ne pas régresser) ; A11y/BP/SEO inchangés (98-100 / 100 / 100).
- AUCUNE différence visuelle perçue : le hero et ses animations rendent identiquement une fois jouées (comparer captures/vidéo avant-après).
- Reveals, pin de la chaîne, transition d'univers, parallaxe curseur : toujours fonctionnels.
- prefers-reduced-motion : contenu immédiat, animations neutralisées.
- build/tsc/lint OK ; 0 erreur console ; 0 scroll horizontal 320→1920.

────────────────────────────────────────
F. RAPPORT FINAL
────────────────────────────────────────
1. Cause LCP confirmée (nœud LCP). 2. Approche retenue (parmi B) + pourquoi. 3. Fichiers modifiés. 4. Dépendances (attendu : 0). 5. Mesures LCP/CLS/Perf AVANT et APRÈS. 6. Preuve d'absence de changement visuel (captures/vidéo). 7. Tests (reduced-motion, pin, transitions, 320px, console). 8. Limites éventuelles / si <2,5 s non atteint, prochaines pistes (ex. réduire le nombre de Reveal simultanés, alléger le mockup).

CONTRAINTES : ne change RIEN de visible ; n'installe rien ; ne touche pas au SEO/redirections/contenu ; ne masque aucun problème ; ne déclare rien terminé sans mesure LCP avant/après.
```

---

## Note (hors bloc)

C'est le dernier écart chiffré de la Phase 6. Après ça, il ne reste que la **Phase 5** (3D/WebGL, optionnelle et esthétique) et les **4 captures** manquantes. Le correctif LCP est prioritaire sur la Phase 5 si l'objectif est une mise en production propre.
