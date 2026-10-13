import { z } from "zod";
import { configSchema } from "./config";

/**
 * Demande d'activation : contact du commerçant + configuration de la carte.
 * Schéma partagé entre le formulaire (client) et l'API (serveur) : la
 * validation serveur ne fait jamais confiance au client.
 */
export const activationContactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(80, "80 caractères maximum."),
  email: z
    .string()
    .trim()
    .max(120, "120 caractères maximum.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Adresse e-mail invalide."),
  phone: z
    .string()
    .trim()
    .max(20, "20 caractères maximum.")
    .refine((v) => v === "" || /^[+0-9 ().-]{6,20}$/.test(v), "Numéro de téléphone invalide."),
  message: z.string().trim().max(1000, "1 000 caractères maximum."),
  consent: z.literal(true, { error: "Votre accord est nécessaire pour que nous puissions vous répondre." }),
  /** Champ piège anti-spam (honeypot) : doit rester vide. */
  companyWebsite: z.string().max(0).optional(),
});

export type ActivationContact = z.infer<typeof activationContactSchema>;

export const activationRequestSchema = z.object({
  contact: activationContactSchema,
  config: configSchema,
});

export type ActivationRequest = z.infer<typeof activationRequestSchema>;

/** Réponses de l'API d'activation (contrat partagé). */
export type ActivationResponse =
  | { ok: true }
  | { ok: false; error: "not_configured" | "invalid" | "rate_limited" | "too_large" | "send_failed"; message: string; fields?: string[] };
