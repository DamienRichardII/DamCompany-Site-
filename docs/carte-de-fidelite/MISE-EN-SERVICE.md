# Carte de fidélité — mise en service

Page : `/carte-de-fidelite`. Rien n'a été déployé en production.

## Ce qui fonctionne sans aucune configuration

- Page, navigation (header + menu mobile) et sitemap.
- Configurateur complet : identité, logo (contrôle de format/poids, recadrage), apparence (4 modèles, couleurs, palettes harmonieuses, contrôle de contraste WCAG avec correction), programme (tampons ou points, validations), récapitulatif.
- Aperçu en direct (carte web + téléphone) et aperçu Apple Wallet **approximatif**, avec adhérent et progression fictifs marqués « Aperçu ».
- Brouillon local versionné (`localStorage`, clé `damcompany:loyalty-draft`), restauré au rechargement, sans donnée d'adhérent ; réinitialisation avec confirmation.
- Sans service configuré, le bloc d'activation affiche « Activation en ligne : bientôt disponible ». Aucun prix n'est affiché (`lib/loyalty/pricing.ts` vaut `null`).
- Le bouton « Ajouter à Apple Wallet » de l'aperçu reste désactivé : un pass n'existe que pour une carte réelle.

## Ce qu'il reste à configurer

Les noms des variables sont dans `.env.example` (section « Carte de fidélité »). Aucune valeur n'est dans le dépôt.

| Fonction | Variables | Effet |
| --- | --- | --- |
| Demande d'activation par e-mail | `RESEND_API_KEY`, `LOYALTY_ACTIVATION_TO`, `LOYALTY_ACTIVATION_FROM` | Le bouton « Demander l'activation » apparaît et envoie la configuration (logo en pièce jointe). |
| Paiement + base | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_LOYALTY_PRICE_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (+ `STRIPE_LOYALTY_MODE`) | Active `/api/loyalty/checkout` et `/api/stripe/webhook`. |
| Apple Wallet | `APPLE_PASS_TYPE_ID`, `APPLE_TEAM_ID`, `APPLE_WWDR_CERT_B64`, `APPLE_SIGNER_CERT_B64`, `APPLE_SIGNER_KEY_B64` (+ passphrase) | Active `/api/wallet/[token]`. |

Étapes :

1. Créer un projet Supabase **de test**, appliquer `supabase/migrations/0001_loyalty.sql`.
2. Créer le produit/prix dans Stripe (le montant n'est jamais dans le code), renseigner `STRIPE_LOYALTY_PRICE_ID`.
3. Déclarer le webhook `https://<domaine>/api/stripe/webhook` pour `checkout.session.completed` et `customer.subscription.deleted`.
4. Obtenir un Pass Type ID et les certificats Apple Developer, les encoder en base64 (`base64 -w0 fichier.pem`).
5. Ajouter les variables dans Vercel (Preview d'abord), pas dans le dépôt.
6. Après `git pull` : `npm install` (nouvelles dépendances, lockfile à jour).

## Garanties de sécurité implémentées

- Un scan de QR ne crédite jamais : le QR individuel contient `DCL1:<jeton>` (identification seulement). Le crédit passe par `credit_card()` / `redeem_reward()`, réservées à un commerçant authentifié propriétaire de la carte.
- RLS sur toutes les tables ; `programs.active` n'est pas modifiable par le client ; `stripe_events` sans policy (serveur seul).
- L'activation vient uniquement du webhook Stripe signé et idempotent (table `stripe_events`) — la page de retour ne suffit pas.
- Jetons imprévisibles : `join_token` (commerce, 18 octets), `public_token` (carte, 24 octets).
- Certificats et clés lus côté serveur uniquement ; clients Supabase créés à la demande.
- API d'activation : honeypot, limite de débit, taille maximale, échappement HTML, validation zod serveur.

## Limites à connaître

- **Non testé contre de vrais services** : Resend, Stripe, Supabase et la signature Apple n'ont pas été appelés. Testés : validation, échappement, limiteur, logique idempotente du webhook (base simulée), génération d'un `.pkpass` signé avec des certificats de test (structure seulement, pas d'ouverture dans Wallet).
- Le SQL n'a pas été exécuté sur une base réelle : à appliquer et vérifier (notamment les policies) sur un projet de test.
- Il n'existe pas encore de portail commerçant (connexion, encaissement des passages, scan, inscription publique via `join_token`) : le socle base/API est prêt, pas l'interface.
- Mise à jour des passes déjà installés (web service Apple, notifications push) : non implémentée.
- Le limiteur de débit est en mémoire (par instance) ; prévoir un stockage partagé en production à fort trafic.
