import { activationRequestSchema, type ActivationRequest } from "../activation-schema";
import { SECTORS, TEMPLATES } from "../config";

/** Échappement HTML pour tout texte saisi par l'utilisateur injecté dans l'e-mail. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Limiteur en mémoire (fenêtre glissante). Best-effort : par instance serverless. */
export class RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(private max: number, private windowMs: number) {}

  allow(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) if (v.every((t) => now - t >= this.windowMs)) this.hits.delete(k);
    }
    return true;
  }
}

export const MAX_BODY_BYTES = 900_000;

export type ParseResult =
  | { kind: "ok"; data: ActivationRequest }
  | { kind: "honeypot" }
  | { kind: "invalid"; fields: string[] };

export function parseActivation(raw: unknown): ParseResult {
  // Honeypot : un robot remplit le champ caché. On répond comme un succès sans rien envoyer.
  const trap = (raw as { contact?: { companyWebsite?: unknown } } | null)?.contact?.companyWebsite;
  if (typeof trap === "string" && trap.trim() !== "") return { kind: "honeypot" };
  const parsed = activationRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { kind: "invalid", fields: [...new Set(parsed.error.issues.map((i) => i.path.join(".")))] };
  }
  return { kind: "ok", data: parsed.data };
}

export function buildActivationEmail(data: ActivationRequest) {
  const { contact, config } = data;
  const sector = SECTORS.find((s) => s.id === config.identity.sector)?.label ?? config.identity.sector;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(label)}</td><td style="padding:4px 0"><strong>${escapeHtml(value || "—")}</strong></td></tr>`;
  const program =
    config.program.mode === "stamps"
      ? `Tampons — objectif ${config.program.stampsGoal}`
      : `Points — objectif ${config.program.pointsGoal} (${config.program.pointsPerEuro} pt/€)`;

  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2>Demande d'activation — carte de fidélité</h2>
<h3>Contact</h3><table>${row("Nom", contact.name)}${row("E-mail", contact.email)}${row("Téléphone", contact.phone ?? "")}${row("Message", contact.message)}</table>
<h3>Carte</h3><table>
${row("Commerce", config.identity.businessName)}${row("Secteur", sector)}${row("Modèle", TEMPLATES[config.appearance.templateId].label)}
${row("Couleurs (fond / texte / accent)", `${config.appearance.background} / ${config.appearance.text} / ${config.appearance.accent}`)}
${row("Programme", program)}${row("Récompense", config.program.rewardLabel)}${row("Conditions", config.program.conditions)}
${row("Logo", config.logo ? "Fourni (voir pièce jointe)" : "Aucun")}
</table></div>`;

  return {
    subject: `Activation carte de fidélité — ${config.identity.businessName}`,
    html,
    text: `Demande d'activation — ${config.identity.businessName}\n${contact.name} <${contact.email}>\n${program}\nRécompense : ${config.program.rewardLabel}`,
  };
}

/** Pièce jointe logo (data URL → base64) si présente et bien formée. */
export function logoAttachment(data: ActivationRequest): { filename: string; content: string } | null {
  const url = data.config.logo?.dataUrl;
  const match = typeof url === "string" ? /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(url) : null;
  if (!match) return null;
  return { filename: `logo.${match[1] === "jpeg" ? "jpg" : match[1]}`, content: match[2] };
}
