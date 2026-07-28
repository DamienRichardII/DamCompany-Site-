# DamCompany — Site officiel

Site officiel multipage de **DamCompany**, agence digitale.
Statique, rapide, responsive et premium — fidèle à la maquette de référence (PJ3).

HTML / CSS / JavaScript uniquement. Aucun framework.

## Structure du projet

```
DamCompany Site V2 - frontend/
│
├── frontend/
│   ├── index.html            # Accueil
│   ├── sites-web.html        # Sites web
│   ├── applications.html     # Applications Mobile / Web
│   ├── ia.html               # Intelligence Artificielle
│   ├── data.html             # Analyse de données
│   ├── automatisation.html   # Automatisation
│   ├── crm.html              # CRM
│   ├── consulting.html       # Consulting
│   ├── contact.html          # Contact (formulaire)
│   ├── css/
│   │   └── style.css         # Styles globaux (commentés par sections)
│   ├── js/
│   │   └── main.js           # Menu mobile, scroll, validation formulaire
│   └── assets/               # Logo, favicon et images des projets
│
├── backend/                  # Backend Express minimal (optionnel)
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md
```

> Le dossier `assets/` original à la racine est conservé ; les images
> utiles ont été copiées dans `frontend/assets/`.

## Lancer le frontend

Le site fonctionne **sans backend**.

Option 1 — ouverture directe :

```
cd frontend
```

Puis ouvrir `index.html` dans le navigateur.

Option 2 — recommandé (Live Server) :
utiliser l'extension **Live Server** de VS Code, ou un petit serveur :

```bash
cd frontend
python -m http.server 5500
# puis ouvrir http://localhost:5500
```

## Lancer le backend (optionnel)

```bash
cd backend
npm install
npm run dev
```

Voir `backend/README.md` pour le détail des routes.
Le formulaire de contact envoie vers `/api/contact` lorsque le site est
servi en HTTP ; en ouverture locale (`file://`), l'envoi est simulé côté
frontend afin de ne jamais bloquer le site.

## Pages & contenu

- **Accueil** : hero (logo géant + cartes flottantes), 7 expertises,
  12 réalisations, bandeau avantages.
- **7 pages services** : hero, éléments de service, projet(s) en avant, CTA.
- **Contact** : coordonnées + formulaire validé côté client.

Header, footer et navigation sont identiques sur toutes les pages.

## Direction artistique

- Fond blanc cassé / beige clair, noir profond, jaune éclair en accent.
- Header blanc flottant, footer noir premium, cartes arrondies, ombres douces.
- Police : Poppins (avec repli système si hors-ligne).

## SEO & partage

Chaque page possède un `title` et une `meta description` uniques, un favicon
basé sur le logo, et des balises Open Graph (`og:title`, `og:description`,
`og:image`, `og:url`, `og:type`).

## Prochaines étapes possibles

- Brancher un vrai envoi d'email sur `/api/contact` (Resend / Nodemailer).
- Remplacer les liens réseaux sociaux (`#`) par les vrais profils.
- Ajouter les vraies coordonnées (téléphone) dans `contact.html`.
- Optimiser les images (WebP) pour accélérer le chargement.
