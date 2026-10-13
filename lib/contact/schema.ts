import { z } from "zod";
import { OFFERS } from "@/content/offers";

export const PROJECT_TYPES = [...OFFERS.map((o) => o.slug), "autre"] as const;

export const PROJECT_LABELS: Record<string, string> = {
  ...Object.fromEntries(OFFERS.map((o) => [o.slug, o.title])),
  autre: "Autre projet",
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom").max(80),
  email: z.string().trim().email("Adresse email invalide").max(120),
  project: z.enum(PROJECT_TYPES, { message: "Choisissez un type de projet" }),
  message: z.string().trim().min(10, "Décrivez votre projet en quelques mots").max(3000),
  /** Honeypot : doit rester vide. */
  website: z.string().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; message: string; fields?: Record<string, string> };
