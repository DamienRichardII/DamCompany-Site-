import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Clients Supabase créés à la demande (jamais à l'import) : le build et les
 * pages publiques fonctionnent sans variables d'environnement.
 * Le client « admin » utilise la clé service_role : SERVEUR UNIQUEMENT.
 */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Client lié au jeton d'un commerçant connecté : la RLS s'applique. */
export function getUserClient(accessToken: string): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
