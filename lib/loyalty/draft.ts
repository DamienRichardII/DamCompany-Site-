import { CONFIG_VERSION, configSchema, defaultConfig, type LoyaltyConfig, type StepId, STEPS } from "./config";

/**
 * Brouillon local du configurateur (localStorage, versionné).
 *
 * RÈGLE : le brouillon ne contient QUE la configuration de la carte du
 * commerçant. Aucune donnée personnelle d'adhérent n'est ni collectée ni
 * stockée ici — le modèle `LoyaltyConfig` ne comporte aucun champ adhérent.
 */

export const DRAFT_KEY = "damcompany:loyalty-draft";

export type DraftEnvelope = {
  version: number;
  savedAt: string; // ISO 8601
  step: StepId;
  config: unknown;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type RestoredDraft = {
  config: LoyaltyConfig;
  step: StepId;
  savedAt: string;
  /** true si certaines sections invalides ont été remplacées par les valeurs par défaut. */
  repaired: boolean;
};

const STEP_IDS = STEPS.map((s) => s.id) as StepId[];

/**
 * Migration d'un brouillon d'une version antérieure vers CONFIG_VERSION.
 * Pour l'instant une seule version existe ; la fonction est le point
 * d'extension pour les évolutions futures du schéma.
 */
export function migrateDraft(envelope: DraftEnvelope): DraftEnvelope | null {
  if (envelope.version === CONFIG_VERSION) return envelope;
  // Versions futures ou inconnues : on ne tente pas de les interpréter.
  return null;
}

/**
 * Champs dont une valeur « en cours de saisie » (vide, hors bornes) est
 * légitime dans un brouillon : seul leur TYPE est contrôlé. Tous les autres
 * champs (couleurs, listes de choix) doivent être strictement valides.
 */
const LENIENT_FIELDS: Record<"identity" | "appearance" | "program", readonly string[]> = {
  identity: ["businessName", "phone", "email", "website", "address"],
  appearance: [],
  program: ["stampsGoal", "pointsGoal", "pointsPerEuro", "rewardLabel", "conditions"],
};

/**
 * Restaure une configuration depuis des données non fiables :
 * 1. configuration entièrement valide → reprise telle quelle ;
 * 2. sinon, validation champ par champ — un champ corrompu retombe sur sa
 *    valeur par défaut (`repaired = true`), les saisies incomplètes sont gardées.
 */
export function sanitizeConfig(raw: unknown): { config: LoyaltyConfig; repaired: boolean } {
  const full = configSchema.safeParse(raw);
  if (full.success) return { config: full.data, repaired: false };

  const defaults = defaultConfig();
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  let repaired = false;

  const mergeSection = <K extends "identity" | "appearance" | "program">(key: K): LoyaltyConfig[K] => {
    const base = source[key];
    const fallback = defaults[key] as Record<string, unknown>;
    if (!base || typeof base !== "object") {
      repaired = true;
      return fallback as LoyaltyConfig[K];
    }
    const shape = configSchema.shape[key].shape as Record<string, { safeParse: (v: unknown) => { success: boolean } }>;
    const out: Record<string, unknown> = { ...fallback };
    for (const field of Object.keys(fallback)) {
      const value = (base as Record<string, unknown>)[field];
      if (value === undefined) continue;
      const strictOk = shape[field].safeParse(value).success;
      const lenientOk =
        LENIENT_FIELDS[key].includes(field) &&
        typeof value === typeof fallback[field] &&
        (typeof value !== "number" || Number.isFinite(value));
      if (strictOk || lenientOk) out[field] = value;
      else repaired = true;
    }
    return out as LoyaltyConfig[K];
  };

  const logoProbe = configSchema.shape.logo.safeParse(source.logo);
  if (!logoProbe.success && source.logo != null) repaired = true;

  return {
    config: {
      identity: mergeSection("identity"),
      appearance: mergeSection("appearance"),
      program: mergeSection("program"),
      logo: logoProbe.success ? logoProbe.data : null,
    },
    repaired,
  };
}

export function saveDraft(storage: StorageLike, config: LoyaltyConfig, step: StepId, now: Date = new Date()): string | null {
  const envelope: DraftEnvelope = {
    version: CONFIG_VERSION,
    savedAt: now.toISOString(),
    step,
    config,
  };
  try {
    storage.setItem(DRAFT_KEY, JSON.stringify(envelope));
    return envelope.savedAt;
  } catch {
    // Quota dépassé ou stockage indisponible (navigation privée) : on n'échoue pas.
    return null;
  }
}

export function loadDraft(storage: StorageLike): RestoredDraft | null {
  let parsed: DraftEnvelope;
  try {
    const raw = storage.getItem(DRAFT_KEY);
    if (!raw) return null;
    parsed = JSON.parse(raw) as DraftEnvelope;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || typeof parsed.version !== "number") return null;

  const migrated = migrateDraft(parsed);
  if (!migrated) return null;

  const { config, repaired } = sanitizeConfig(migrated.config);
  const step = STEP_IDS.includes(migrated.step) ? migrated.step : "identity";
  return {
    config,
    step,
    savedAt: typeof migrated.savedAt === "string" ? migrated.savedAt : new Date(0).toISOString(),
    repaired,
  };
}

export function clearDraft(storage: StorageLike): void {
  try {
    storage.removeItem(DRAFT_KEY);
  } catch {
    /* rien à faire */
  }
}
