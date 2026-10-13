import { NextResponse } from "next/server";
import { RateLimiter, escapeHtml } from "@/lib/loyalty/server/activation";
import { PROJECT_LABELS, contactSchema, type ContactResponse } from "@/lib/contact/schema";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new RateLimiter(5, 10 * 60 * 1000);
const MAX_BODY = 20_000;

const json = (body: ContactResponse, status: number) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO?.trim() || SITE.email;
  const from = process.env.CONTACT_FROM?.trim() || `DamCompany <site@${SITE.domain}>`;

  if (!key) {
    return json(
      {
        ok: false,
        error: "not_configured",
        message: `Le formulaire n'est pas encore actif. Écrivez-nous à ${SITE.email}.`,
      },
      503
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!limiter.allow(ip)) {
    return json({ ok: false, error: "rate_limited", message: "Trop de demandes. Réessayez dans quelques minutes." }, 429);
  }

  const text = await request.text();
  if (text.length > MAX_BODY) {
    return json({ ok: false, error: "too_large", message: "Votre message est trop long." }, 413);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "invalid", message: "Requête illisible." }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      fields[k] ??= issue.message;
    }
    return json({ ok: false, error: "invalid", message: "Certains champs sont invalides.", fields }, 400);
  }

  const d = parsed.data;
  if (d.website) return json({ ok: true }, 200); // robot : succès apparent, rien n'est envoyé

  const projectLabel = PROJECT_LABELS[d.project] ?? d.project;
  const subject = `Nouvelle demande — ${projectLabel} — ${d.name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 12px">Nouvelle demande depuis ${escapeHtml(SITE.domain)}</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Nom</td><td><strong>${escapeHtml(d.name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><strong>${escapeHtml(d.email)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Projet</td><td><strong>${escapeHtml(projectLabel)}</strong></td></tr>
      </table>
      <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(d.message)}</p>
    </div>`;
  const plain = `Nom : ${d.name}\nEmail : ${d.email}\nProjet : ${projectLabel}\n\n${d.message}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: d.email, subject, html, text: plain }),
    });
    if (!res.ok) {
      console.error("[contact] Resend a refusé l'envoi", res.status);
      return json({ ok: false, error: "send_failed", message: "L'envoi a échoué. Réessayez plus tard." }, 502);
    }
    return json({ ok: true }, 200);
  } catch (err) {
    console.error("[contact] erreur réseau", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "send_failed", message: "L'envoi a échoué. Réessayez plus tard." }, 502);
  }
}
