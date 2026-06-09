# DamCompany — Backend

Backend minimal Express pour gérer le formulaire de contact du site.
**Optionnel** : le site frontend fonctionne entièrement sans ce backend.

## Lancer le backend

```bash
cd backend
npm install
npm run dev      # ou : npm start
```

Le serveur démarre sur `http://localhost:4000`.

## Variables d'environnement

Copier `.env.example` en `.env` et adapter si besoin :

```bash
cp .env.example .env
```

## Routes

| Méthode | Route          | Description                          |
|---------|----------------|--------------------------------------|
| GET     | `/api/health`  | Vérifie que le serveur tourne.       |
| POST    | `/api/contact` | Reçoit une demande du formulaire.    |

### Exemple — `POST /api/contact`

Corps attendu (JSON) :

```json
{
  "prenom": "Damien",
  "nom": "Miyouna",
  "email": "vous@email.com",
  "telephone": "+33 6 00 00 00 00",
  "service": "Site web",
  "message": "Bonjour, j'ai un projet…"
}
```

Réponse :

```json
{
  "success": true,
  "message": "Demande reçue avec succès."
}
```

## Prochaine étape — envoi d'email

Le point d'envoi est préparé dans `server.js` (commentaire `TODO`).
Pour brancher un vrai envoi : installer un service (ex. Resend, Nodemailer),
renseigner les clés dans `.env`, puis compléter la route `/api/contact`.
