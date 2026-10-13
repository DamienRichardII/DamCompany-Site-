# DamCompany — version « maquette » (branche `feat/v3-maquette`)

Refonte du site pour reprendre la direction artistique de la maquette (crème / noir / jaune #FEDD58)
avec les 13 écrans.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · CSS design system (`styles/tokens.css`,
`styles/site.css`) · GSAP + Lenis (animations / scroll) · Zod · Resend (emails) · Supabase (`@supabase/ssr`) ·
Vercel (hébergement, Analytics, Speed Insights).

## Les 13 écrans → routes

| #  | Écran                       | Route                              |
|----|-----------------------------|------------------------------------|
| 01 | Accueil (+ version mobile)  | `/`                                |
| 02 | Création de site internet   | `/services/site-internet`          |
| 03 | Application mobile          | `/services/application-mobile`     |
| 04 | Création d'IA               | `/services/creation-ia`            |
| 05 | CRM 3D personnalisée        | `/services/crm-3d`                 |
| 06 | Reporting automatisé        | `/services/reporting-automatise`   |
| 07 | Vidéo promo motion design   | `/services/motion-design`          |
| 08 | Carte fidélité digitale 3D  | `/services/carte-fidelite-3d` (+ configurateur existant `/carte-de-fidelite`) |
| 09 | Supports de création        | `/services/supports-de-creation`   |
| 10 | À propos                    | `/a-propos`                        |
| 11 | Notre équipe                | `/equipe`                          |
| 12 | Contact                     | `/contact`                         |
| 13 | Mentions légales            | `/mentions-legales`                |

Aussi : `/services` (index), `/realisations` (existant), `/admin` (voir ci-dessous).

## Où modifier quoi

- Textes des 8 services : `content/offers.ts`
- Coordonnées, stats, réseaux : `lib/site.ts` (+ variables `NEXT_PUBLIC_*`)
- Mentions légales : `components/site/Blocks.tsx` (`LegalBlock`) + variables `NEXT_PUBLIC_LEGAL_*`
- Visuels codés (laptop, téléphones, carte 3D, dashboards) : `components/visuals/Visuals.tsx`
- Remplacer un visuel par une vraie image : déposer le fichier dans `public/` à l'emplacement attendu,
  il est détecté automatiquement (`lib/media.ts`) :
  - `public/images/team/damien.webp`, `createur.webp`, `developpeur.webp`
  - `public/images/a-propos-showroom.webp`

## Domaine damcompany.tech et espace admin

Le site public vit sur **damcompany.tech**. Le dashboard business devient l'espace admin du même projet :

- Route group `app/(admin)/admin/*` (login, accueil, déconnexion) sans header/footer public.
- `proxy.ts` (Next 16 : remplace `middleware.ts`) protège `/admin/*` : session Supabase + email présent
  dans `ADMIN_EMAILS`. `requireAdmin()` (`lib/admin/auth.ts`) re-vérifie côté serveur.
- `/admin` est exclu des moteurs (`robots.ts` + `noindex`).
- Migration du dashboard existant : ajouter ses pages sous `app/(admin)/admin/…` et appeler
  `await requireAdmin()` en tête de chaque page serveur.

### Bascule du domaine (à faire dans l'ordre)

1. Déployer cette branche sur le projet Vercel du site (preview) et vérifier.
2. Migrer le dashboard dans `/admin` (ou le garder temporairement sur `admin.damcompany.tech`).
3. Retirer `damcompany.tech` du projet Vercel du dashboard, puis l'ajouter au projet du site.
4. Renseigner les variables d'environnement (voir `.env.example`) sur Vercel.
