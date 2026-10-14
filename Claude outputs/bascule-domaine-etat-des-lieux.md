# Bascule de domaine damcompany.tech — état des lieux (13 oct. 2026)

Statut : EN PAUSE. On finit le design du site avant de toucher au domaine. Rien n'a été déplacé ; le dashboard reste en ligne sur damcompany.tech.

Objectif : site (`dam-company-site`) sur damcompany.tech + www ; dashboard (`damcompany-db`) sur admin.damcompany.tech.

État : admin.damcompany.tech est déjà rattaché à `damcompany-db` mais sans DNS. damcompany.tech et www sont encore sur `damcompany-db`. DNS chez OVH.

À faire plus tard :
1. OVH : CNAME `admin` -> `cname.vercel-dns.com.` ; supprimer l'AAAA `2001:41d0:301::29` de l'apex ; apex A 216.150.1.1 + 216.150.16.1 ; `www` CNAME -> `cname.vercel-dns.com.`
2. Vercel : vérifier admin, retirer apex+www de `damcompany-db`, les ajouter à `dam-company-site`, repointer la redirection de damcompany-db.vercel.app vers admin
3. Env prod de `dam-company-site` : RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, NEXT_PUBLIC_SITE_URL, Supabase, ADMIN_EMAILS, NEXT_PUBLIC_LEGAL_*, URL TikTok/Instagram
4. Dashboard : URL de redirection Supabase, liens Resend, CORS -> admin.damcompany.tech

Design à finir d'abord : handles réseaux, email .tech/.fr, noms équipe, SIRET, images dans /public/images/.
