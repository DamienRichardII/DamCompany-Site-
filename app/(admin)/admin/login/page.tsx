import Link from "next/link";
import { Logo } from "@/components/brand/Brand";
import { LoginForm } from "./LoginForm";
import { supabaseEnv, adminEmails } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const configured = Boolean(supabaseEnv()) && adminEmails().length > 0;
  return (
    <main className="v-admin-login">
      <div className="v-admin-box">
        <Logo />
        <h1>Espace administrateur</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="v-form-error" role="alert">
            L&apos;espace admin n&apos;est pas encore configuré : renseignez NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY et ADMIN_EMAILS dans les variables d&apos;environnement.
          </p>
        )}
        <Link href="/" className="v-admin-back">
          ← Retour au site
        </Link>
      </div>
    </main>
  );
}
