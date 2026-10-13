import { NextResponse } from "next/server";
import { getCapabilities } from "@/lib/loyalty/capabilities";
import type { ActivationResponse } from "@/lib/loyalty/activation-schema";
import {
  MAX_BODY_BYTES,
  RateLimiter,
  buildActivationEmail,
  logoAttachment,
  parseActivation,
} from "@/lib/loyalty/server/activation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new RateLimiter(5, 10 * 60 * 1000);

const json = (body: ActivationResponse, status: number) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  if (!getCapabilities().activationRequests) {
    return json(
      { ok: false, error: "not_configured", message: "La demande d'activation en ligne n'est pas encore ouverte." },
      503
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!limiter.allow(ip)) {
    return json({ ok: false, error: "rate_limited", message: "Trop de demandes. Réessayez dans quelques minutes." }, 429);
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return json({ ok: false, error: "too_large", message: "La demande est trop volumineuse." }, 413);
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "too_large", message: "La demande est trop volumineuse." }, 413);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "invalid", message: "Requête illisible." }, 400);
  }

  const parsed = parseActivation(raw);
  if (parsed.kind === "honeypot") return json({ ok: true }, 200); // robot : succès apparent, rien n'est envoyé
  if (parsed.kind === "invalid") {
    return json({ ok: false, error: "invalid", message: "Certains champs sont invalides.", fields: parsed.fields }, 400);
  }

  const { subject, html, text: plain } = buildActivationEmail(parsed.data);
  const attachment = logoAttachment(parsed.data);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LOYALTY_ACTIVATION_FROM,
        to: [process.env.LOYALTY_ACTIVATION_TO],
        reply_to: parsed.data.contact.email,
        subject,
        html,
        text: plain,
        ...(attachment ? { attachments: [attachment] } : {}),
      }),
    });
    if (!response.ok) {
      console.error("[loyalty/activation] Resend a refusé l'envoi", response.status);
      return json({ ok: false, error: "send_failed", message: "L'envoi a échoué. Réessayez plus tard." }, 502);
    }
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[loyalty/activation] erreur réseau", error instanceof Error ? error.message : error);
    return json({ ok: false, error: "send_failed", message: "L'envoi a échoué. Réessayez plus tard." }, 502);
  }
}
