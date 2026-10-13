import { z } from "zod";

/**
 * Modèle de configuration d'une carte de fidélité (configurateur).
 * Source unique : schéma Zod → types, validations, brouillon local.
 * AUCUNE donnée d'adhérent n'entre dans ce modèle (voir draft.ts).
 */

export const CONFIG_VERSION = 1;

/* ---------- Référentiels ---------- */

export const SECTORS = [
  { id: "cafe-restaurant", label: "Café, restaurant" },
  { id: "boulangerie", label: "Boulangerie, pâtisserie" },
  { id: "coiffure-beaute", label: "Coiffure, beauté" },
  { id: "boutique", label: "Boutique, commerce de détail" },
  { id: "bien-etre-sport", label: "Bien-être, sport" },
  { id: "services", label: "Services" },
  { id: "autre", label: "Autre" },
] as const;

export type SectorId = (typeof SECTORS)[number]["id"];
const SECTOR_IDS = SECTORS.map((s) => s.id) as [SectorId, ...SectorId[]];

export const TEMPLATE_IDS = ["minimal", "elegant", "colorful", "dark"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export type LoyaltyMode = "stamps" | "points";

export const LIMITS = {
  nameMin: 2,
  nameMax: 40,
  addressMax: 120,
  rewardMin: 3,
  rewardMax: 60,
  conditionsMax: 500,
  stampsMin: 3,
  stampsMax: 24,
  pointsMin: 10,
  pointsMax: 100_000,
  pointsPerEuroMax: 100,
  logoMaxFileBytes: 2 * 1024 * 1024,
  logoMaxStoredChars: 280_000,
} as const;

/* ---------- Modèles prédéfinis ---------- */

export type PatternId = "none" | "frame" | "bubbles" | "glow";
export type StampShape = "circle" | "rounded" | "star";
export type FontStyle = "sans" | "serif";

export type TemplateDef = {
  id: TemplateId;
  label: string;
  description: string;
  colors: { background: string; text: string; accent: string };
  pattern: PatternId;
  stampShape: StampShape;
  fontStyle: FontStyle;
};

export const TEMPLATES: Record<TemplateId, TemplateDef> = {
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "Épuré, sans fioriture.",
    colors: { background: "#FAFAF7", text: "#171717", accent: "#171717" },
    pattern: "none",
    stampShape: "circle",
    fontStyle: "sans",
  },
  elegant: {
    id: "elegant",
    label: "Élégant",
    description: "Cadre fin, typographie à empattements.",
    colors: { background: "#F4ECE0", text: "#2A2017", accent: "#8A6A2F" },
    pattern: "frame",
    stampShape: "rounded",
    fontStyle: "serif",
  },
  colorful: {
    id: "colorful",
    label: "Coloré",
    description: "Aplat vif et formes rondes.",
    colors: { background: "#5B3DF5", text: "#FFFFFF", accent: "#FFD23F" },
    pattern: "bubbles",
    stampShape: "star",
    fontStyle: "sans",
  },
  dark: {
    id: "dark",
    label: "Sombre",
    description: "Fond profond, accent lumineux.",
    colors: { background: "#0E1116", text: "#F4F4F5", accent: "#FFC83D" },
    pattern: "glow",
    stampShape: "circle",
    fontStyle: "sans",
  },
};

/* ---------- Schéma ---------- */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur hexadécimale attendue (ex. #1A1A1A).");

/** Champ facultatif : vide accepté, sinon validé par `test`. */
const optionalText = (max: number, test: (v: string) => boolean, message: string) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères maximum.`)
    .refine((v) => v === "" || test(v), message);

export function isValidWebsite(value: string): boolean {
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const identitySchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(LIMITS.nameMin, `Indiquez le nom de votre commerce (${LIMITS.nameMin} caractères minimum).`)
    .max(LIMITS.nameMax, `${LIMITS.nameMax} caractères maximum.`),
  sector: z.enum(SECTOR_IDS, { error: "Choisissez votre secteur d'activité." }),
  phone: optionalText(20, (v) => /^[+0-9 ().-]{6,20}$/.test(v), "Numéro de téléphone invalide."),
  email: optionalText(120, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Adresse e-mail invalide."),
  website: optionalText(200, isValidWebsite, "Adresse de site invalide (ex. monsite.fr)."),
  address: z.string().trim().max(LIMITS.addressMax, `${LIMITS.addressMax} caractères maximum.`),
});

const appearanceSchema = z.object({
  templateId: z.enum(TEMPLATE_IDS),
  background: hex,
  text: hex,
  accent: hex,
});

const intField = (label: string) =>
  z.number({ error: `${label} : saisissez un nombre.` }).int(`${label} : un nombre entier est attendu.`);

const programSchema = z
  .object({
    mode: z.enum(["stamps", "points"], { error: "Choisissez un mode de fidélité." }),
    stampsGoal: intField("Nombre de tampons")
      .min(LIMITS.stampsMin, `Au moins ${LIMITS.stampsMin} tampons.`)
      .max(LIMITS.stampsMax, `${LIMITS.stampsMax} tampons maximum.`),
    pointsGoal: intField("Objectif de points")
      .min(LIMITS.pointsMin, `Au moins ${LIMITS.pointsMin} points.`)
      .max(LIMITS.pointsMax, `${LIMITS.pointsMax.toLocaleString("fr-FR")} points maximum.`),
    pointsPerEuro: intField("Points par euro")
      .min(1, "Au moins 1 point par euro.")
      .max(LIMITS.pointsPerEuroMax, `${LIMITS.pointsPerEuroMax} points par euro maximum.`),
    rewardLabel: z
      .string()
      .trim()
      .min(LIMITS.rewardMin, `Décrivez la récompense (${LIMITS.rewardMin} caractères minimum).`)
      .max(LIMITS.rewardMax, `${LIMITS.rewardMax} caractères maximum.`),
    conditions: z.string().trim().max(LIMITS.conditionsMax, `${LIMITS.conditionsMax} caractères maximum.`),
  })
  .superRefine((program, ctx) => {
    // Cohérence propre au mode choisi : l'objectif de points doit pouvoir
    // être atteint, au minimum, avec un achat d'un euro.
    if (program.mode === "points" && program.pointsGoal < program.pointsPerEuro) {
      ctx.addIssue({
        code: "custom",
        path: ["pointsGoal"],
        message: "L'objectif doit être au moins égal aux points gagnés pour 1 €.",
      });
    }
  });

const logoSchema = z
  .object({
    dataUrl: z
      .string()
      .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, "Image du logo invalide.")
      .max(LIMITS.logoMaxStoredChars, "Logo trop volumineux après traitement."),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    zoom: z.number().min(1).max(3),
    offsetX: z.number().min(-50).max(50),
    offsetY: z.number().min(-50).max(50),
    shape: z.enum(["circle", "rounded"]),
    dominant: hex.optional(),
  })
  .nullable();

export const configSchema = z.object({
  identity: identitySchema,
  appearance: appearanceSchema,
  program: programSchema,
  logo: logoSchema,
});

export type LoyaltyConfig = z.infer<typeof configSchema>;
export type LogoConfig = NonNullable<LoyaltyConfig["logo"]>;
export type IdentityConfig = LoyaltyConfig["identity"];
export type AppearanceConfig = LoyaltyConfig["appearance"];
export type ProgramConfig = LoyaltyConfig["program"];

/** Étapes du configurateur et champs validés à chaque étape. */
export const STEPS = [
  { id: "identity", label: "Identité", fields: ["identity", "logo"] },
  { id: "appearance", label: "Apparence", fields: ["appearance"] },
  { id: "program", label: "Programme", fields: ["program"] },
  { id: "recap", label: "Récapitulatif", fields: [] },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

/* ---------- Valeurs par défaut ---------- */

export function suggestedConditions(mode: LoyaltyMode): string {
  return mode === "stamps"
    ? "Un tampon par passage, non cumulable avec d'autres offres. Récompense non échangeable contre de l'argent."
    : "Les points sont crédités à chaque achat selon le barème affiché. Récompense non échangeable contre de l'argent.";
}

export const DEFAULT_CONDITIONS = suggestedConditions("stamps");

export function defaultConfig(templateId: TemplateId = "minimal"): LoyaltyConfig {
  const tpl = TEMPLATES[templateId];
  return {
    identity: {
      businessName: "",
      sector: "cafe-restaurant",
      phone: "",
      email: "",
      website: "",
      address: "",
    },
    appearance: { templateId, ...tpl.colors },
    program: {
      mode: "stamps",
      stampsGoal: 10,
      pointsGoal: 500,
      pointsPerEuro: 1,
      rewardLabel: "",
      conditions: DEFAULT_CONDITIONS,
    },
    logo: null,
  };
}

export function applyTemplate(config: LoyaltyConfig, templateId: TemplateId): LoyaltyConfig {
  return {
    ...config,
    appearance: { templateId, ...TEMPLATES[templateId].colors },
  };
}

/* ---------- Aperçu tolérant ---------- */

export type PreviewModel = {
  name: string;
  hasName: boolean;
  sectorLabel: string;
  mode: LoyaltyMode;
  goal: number;
  progress: number;
  rewardLabel: string;
  hasReward: boolean;
  colors: { background: string; text: string; accent: string };
  template: TemplateDef;
  logo: LogoConfig | null;
  website: string;
};

const clampInt = (value: unknown, min: number, max: number, fallback: number) => {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.max(min, Math.min(max, n));
};

const safeHex = (value: unknown, fallback: string) =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;

/**
 * Transforme des valeurs de formulaire potentiellement incomplètes ou
 * invalides en un modèle d'aperçu toujours affichable (jamais de NaN).
 * L'aperçu montre une progression FICTIVE (≈ 60 %).
 */
export function toPreviewModel(values: DeepPartial<LoyaltyConfig>): PreviewModel {
  const templateId = (TEMPLATE_IDS as readonly string[]).includes(values.appearance?.templateId ?? "")
    ? (values.appearance!.templateId as TemplateId)
    : "minimal";
  const template = TEMPLATES[templateId];
  const mode: LoyaltyMode = values.program?.mode === "points" ? "points" : "stamps";
  const goal =
    mode === "stamps"
      ? clampInt(values.program?.stampsGoal, LIMITS.stampsMin, LIMITS.stampsMax, 10)
      : clampInt(values.program?.pointsGoal, LIMITS.pointsMin, LIMITS.pointsMax, 500);
  const name = (values.identity?.businessName ?? "").trim();
  const reward = (values.program?.rewardLabel ?? "").trim();
  const sector = SECTORS.find((s) => s.id === values.identity?.sector);

  return {
    name: name || "Votre commerce",
    hasName: name.length > 0,
    sectorLabel: sector?.label ?? "",
    mode,
    goal,
    progress: Math.max(1, Math.round(goal * 0.6)),
    rewardLabel: reward || "Votre récompense",
    hasReward: reward.length > 0,
    colors: {
      background: safeHex(values.appearance?.background, template.colors.background),
      text: safeHex(values.appearance?.text, template.colors.text),
      accent: safeHex(values.appearance?.accent, template.colors.accent),
    },
    template,
    logo: (values.logo as LogoConfig | null | undefined) ?? null,
    website: (values.identity?.website ?? "").trim(),
  };
}

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/** Libellé court de la progression ("6 / 10 tampons", "300 / 500 pts"). */
export function progressLabel(model: Pick<PreviewModel, "mode" | "goal" | "progress">): string {
  return model.mode === "stamps"
    ? `${model.progress} / ${model.goal} tampons`
    : `${model.progress.toLocaleString("fr-FR")} / ${model.goal.toLocaleString("fr-FR")} pts`;
}
