"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { OFFERS } from "@/content/offers";
import type { ContactResponse } from "@/lib/contact/schema";
import { SITE } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ defaultProject = "" }: { defaultProject?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    setFields({});
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as ContactResponse;
      if (body.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      setStatus("error");
      setMessage(body.message);
      setFields(body.fields ?? {});
    } catch {
      setStatus("error");
      setMessage(`Connexion impossible. Écrivez-nous sur WhatsApp au ${SITE.phone}.`);
    }
  }

  if (status === "sent") {
    return (
      <div className="v-form-done" role="status">
        <span>
          <Check size={22} aria-hidden />
        </span>
        <h3>Merci, votre demande est bien partie.</h3>
        <p>Nous revenons vers vous très rapidement.</p>
      </div>
    );
  }

  return (
    <form className="v-form" onSubmit={onSubmit} noValidate>
      <div className="v-form-row">
        <label>
          <span>Nom</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={!!fields.name} />
          {fields.name && <em>{fields.name}</em>}
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={120} aria-invalid={!!fields.email} />
          {fields.email && <em>{fields.email}</em>}
        </label>
      </div>

      <label>
        <span>Votre projet</span>
        <select name="project" required defaultValue={defaultProject} aria-invalid={!!fields.project}>
          <option value="" disabled>
            Choisissez un type de projet
          </option>
          {OFFERS.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.title}
            </option>
          ))}
          <option value="autre">Autre projet</option>
        </select>
        {fields.project && <em>{fields.project}</em>}
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" rows={5} required minLength={10} maxLength={3000} aria-invalid={!!fields.message} />
        {fields.message && <em>{fields.message}</em>}
      </label>

      {/* Honeypot anti-spam : invisible pour les humains. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden className="v-hp" />

      {status === "error" && message && (
        <p className="v-form-error" role="alert">
          {message}
        </p>
      )}

      <button type="submit" className="v-btn v-btn-dark v-btn-block" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Envoyer ma demande"} <ArrowRight size={16} aria-hidden />
      </button>
    </form>
  );
}
