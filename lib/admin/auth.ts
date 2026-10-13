import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/env";

/**
 * Garde serveur de /admin (en plus de proxy.ts — défense en profondeur).
 * Redirige vers /admin/login si l'utilisateur n'est pas un admin autorisé.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");
  return user;
}
