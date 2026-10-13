"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createBrowserSupabase();
    if (!supabase) return setError("Configuration Supabase manquante.");
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    });
    setBusy(false);
    if (err) return setError("Identifiants invalides.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="v-form" onSubmit={onSubmit}>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        <span>Mot de passe</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && (
        <p className="v-form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="v-btn v-btn-dark v-btn-block" disabled={busy}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
