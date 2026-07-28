# Journal d'exécution — Refonte immersive DamCompany

> Journal de bord de l'exécution du prompt `13-prompt-execution-claude-code.md`.
> Mis à jour au fil de l'exécution, dans l'ordre chronologique.

---

## Phase 0 — Sauvegarde & diagnostic (2026-07-28)

### État initial confirmé

- **Stack réelle :** site statique vanilla, confirmé par inspection directe :
  - `frontend/` : `index.html` + 7 pages services (`sites-web`, `applications`, `ia`, `data`, `automatisation`, `crm`, `consulting`) + `contact.html`.
  - `frontend/css/style.css`, `frontend/js/main.js` — aucune dépendance front, aucun bundler, aucun `package.json` à la racine du frontend.
  - `backend/` : Express minimal (`server.js`, `package.json` avec `express`, `cors`, `dotenv`), route `POST /api/contact`. Optionnel, non requis pour servir le site.
  - **Aucun `Damcompany-code-guardrails.md` trouvé à la racine du dépôt** malgré la mention dans le prompt — absence documentée ici, non bloquante (les guardrails du prompt section A/H ont été appliqués directement : modification chirurgicale, zéro régression, pas de dépendance non justifiée).
- **Vérification fonctionnelle :**
  - `node --check frontend/js/main.js` → OK.
  - `node --check backend/server.js` → OK.
  - Pas de commande "build" existante (site statique ouvert directement ou servi via un serveur statique) : rien à build sur `main`.
- **Doublon d'assets constaté :** le dossier racine `assets/` (15 PNG) contient les mêmes images que `frontend/assets/`, qui ajoute en plus `logo.svg` et `favicon.svg`. Le `README.md` confirme : *« Le dossier assets/ original à la racine est conservé ; les images utiles ont été copiées dans frontend/assets/ »*. Décision : les deux dossiers sont déplacés tels quels dans `legacy-static/`, rien n'est supprimé ni fusionné à ce stade.
- **Environnement :** Node v25.2.1, npm 9.5.1.
- **Git :** dépôt propre sur `main` (`a03956b Site officiel DamCompany - multipage`), seul `docs/` était untracked. Aucune perte de travail en cours constatée.

### Actions Phase 0

1. Création de la branche dédiée `feat/refonte-immersive` depuis `main` (à jour avec `origin/main`). `main` non touché.
2. Rédaction de ce journal.

### Décision d'intégration Next.js (à appliquer en Phase 1)

Conformément à la recommandation du doc 08/13 : **Next.js initialisé à la racine du dépôt**, ancien site statique déplacé intégralement (avec historique Git via `git mv`) vers `/legacy-static/` :

```
legacy-static/
├─ frontend/   (html/css/js/assets existants, inchangés)
├─ backend/    (Express existant, inchangé)
├─ assets/     (dossier racine original, inchangé)
└─ README.md   (README existant, déplacé tel quel)
```

Un nouveau `README.md` à la racine documentera la coexistence des deux bases le temps de la migration.

---

## Phase 1 — Fondations

*(à compléter)*

---

## Phase 2 — Prototype immersif (Loader / Header / Hero)

*(à compléter)*
