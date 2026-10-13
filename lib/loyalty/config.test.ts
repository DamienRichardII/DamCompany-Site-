import test from "node:test";
import assert from "node:assert/strict";

import {
  TEMPLATES,
  TEMPLATE_IDS,
  applyTemplate,
  configSchema,
  defaultConfig,
  toPreviewModel,
  progressLabel,
  isValidWebsite,
  type LoyaltyConfig,
} from "./config";
import { evaluateContrast, WCAG_AA_GRAPHIC, WCAG_AA_TEXT } from "./color";
import {
  DRAFT_KEY,
  clearDraft,
  loadDraft,
  saveDraft,
  sanitizeConfig,
  type StorageLike,
} from "./draft";
import { detectImageFormat, validateLogoBytes } from "./logo";

const valid = (): LoyaltyConfig => {
  const c = defaultConfig();
  c.identity.businessName = "Maison Lumière";
  c.program.rewardLabel = "Un café offert";
  return c;
};

function memoryStorage(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

/* ---------- Modèles ---------- */

test("les 4 modèles prédéfinis respectent les seuils de lisibilité", () => {
  for (const id of TEMPLATE_IDS) {
    const checks = evaluateContrast(TEMPLATES[id].colors);
    const text = checks.find((c) => c.id === "text")!;
    const accent = checks.find((c) => c.id === "accent")!;
    assert.ok(text.ratio >= WCAG_AA_TEXT, `${id} : texte ${text.ratio.toFixed(2)}`);
    assert.ok(accent.ratio >= WCAG_AA_GRAPHIC, `${id} : accent ${accent.ratio.toFixed(2)}`);
  }
});

test("applyTemplate remplace les couleurs et le modèle sans toucher au reste", () => {
  const base = valid();
  const next = applyTemplate(base, "dark");
  assert.equal(next.appearance.templateId, "dark");
  assert.equal(next.appearance.background, TEMPLATES.dark.colors.background);
  assert.equal(next.identity.businessName, "Maison Lumière");
});

/* ---------- Validation du programme ---------- */

test("une configuration complète est valide", () => {
  assert.equal(configSchema.safeParse(valid()).success, true);
});

test("nom et récompense obligatoires", () => {
  const r = configSchema.safeParse(defaultConfig());
  assert.equal(r.success, false);
  const paths = r.error!.issues.map((i) => i.path.join("."));
  assert.ok(paths.includes("identity.businessName"));
  assert.ok(paths.includes("program.rewardLabel"));
});

test("tampons : valeurs négatives, nulles, décimales ou hors bornes refusées", () => {
  for (const bad of [-5, 0, 2, 25, 4.5, Number.NaN]) {
    const c = valid();
    c.program.stampsGoal = bad;
    assert.equal(configSchema.safeParse(c).success, false, `stampsGoal=${bad}`);
  }
  for (const ok of [3, 10, 24]) {
    const c = valid();
    c.program.stampsGoal = ok;
    assert.equal(configSchema.safeParse(c).success, true, `stampsGoal=${ok}`);
  }
});

test("points : objectif négatif ou trop bas refusé, points par euro borné", () => {
  const c = valid();
  c.program.mode = "points";
  c.program.pointsGoal = -10;
  assert.equal(configSchema.safeParse(c).success, false);
  c.program.pointsGoal = 9;
  assert.equal(configSchema.safeParse(c).success, false);
  c.program.pointsGoal = 500;
  c.program.pointsPerEuro = 0;
  assert.equal(configSchema.safeParse(c).success, false);
  c.program.pointsPerEuro = 101;
  assert.equal(configSchema.safeParse(c).success, false);
  c.program.pointsPerEuro = 2;
  assert.equal(configSchema.safeParse(c).success, true);
});

test("points : objectif inférieur aux points gagnés pour 1 € = incohérent", () => {
  const c = valid();
  c.program.mode = "points";
  c.program.pointsGoal = 10;
  c.program.pointsPerEuro = 50;
  const r = configSchema.safeParse(c);
  assert.equal(r.success, false);
  assert.ok(r.error!.issues.some((i) => i.path.join(".") === "program.pointsGoal"));
});

test("coordonnées facultatives : vides acceptées, invalides refusées", () => {
  const c = valid();
  assert.equal(configSchema.safeParse(c).success, true);
  c.identity.email = "pas-un-email";
  assert.equal(configSchema.safeParse(c).success, false);
  c.identity.email = "contact@maison.fr";
  c.identity.phone = "abc";
  assert.equal(configSchema.safeParse(c).success, false);
  c.identity.phone = "+33 1 23 45 67 89";
  c.identity.website = "javascript:alert(1)";
  assert.equal(configSchema.safeParse(c).success, false);
  c.identity.website = "maison.fr";
  assert.equal(configSchema.safeParse(c).success, true);
});

test("isValidWebsite n'accepte que http(s)", () => {
  assert.equal(isValidWebsite("https://exemple.fr/page"), true);
  assert.equal(isValidWebsite("exemple.fr"), true);
  assert.equal(isValidWebsite("ftp://exemple.fr"), false);
  assert.equal(isValidWebsite("javascript:alert(1)"), false);
  assert.equal(isValidWebsite("localhost"), false);
});

test("couleurs : seul le format #RRGGBB est accepté", () => {
  const c = valid();
  c.appearance.accent = "rouge";
  assert.equal(configSchema.safeParse(c).success, false);
  c.appearance.accent = "#12";
  assert.equal(configSchema.safeParse(c).success, false);
});

/* ---------- Aperçu ---------- */

test("toPreviewModel tolère les valeurs invalides (jamais de NaN)", () => {
  const m = toPreviewModel({
    identity: { businessName: "  " },
    appearance: { templateId: "inconnu" as never, accent: "oups" },
    program: { mode: "stamps", stampsGoal: Number.NaN },
  });
  assert.equal(m.hasName, false);
  assert.equal(m.goal, 10);
  assert.ok(Number.isFinite(m.progress));
  assert.match(m.colors.accent, /^#[0-9a-fA-F]{6}$/);
  assert.equal(m.template.id, "minimal");
});

test("progressLabel", () => {
  assert.equal(progressLabel({ mode: "stamps", goal: 10, progress: 6 }), "6 / 10 tampons");
  assert.match(progressLabel({ mode: "points", goal: 500, progress: 300 }), /300 \/ 500 pts/);
});

/* ---------- Brouillon ---------- */

test("brouillon : sauvegarde puis restauration à l'identique", () => {
  const storage = memoryStorage();
  const config = valid();
  config.appearance = { ...config.appearance, accent: "#123456" };
  const savedAt = saveDraft(storage, config, "program", new Date("2026-01-02T03:04:05Z"));
  assert.equal(savedAt, "2026-01-02T03:04:05.000Z");

  const restored = loadDraft(storage)!;
  assert.equal(restored.step, "program");
  assert.equal(restored.repaired, false);
  assert.deepEqual(restored.config, config);
});

test("brouillon : contient la version et aucune donnée d'adhérent", () => {
  const storage = memoryStorage();
  saveDraft(storage, valid(), "identity");
  const raw = JSON.parse(storage.map.get(DRAFT_KEY)!);
  assert.equal(raw.version, 1);
  const keys = JSON.stringify(raw).toLowerCase();
  for (const forbidden of ["member", "adherent", "adhérent", "client", "customer"]) {
    assert.ok(!keys.includes(`"${forbidden}`), `clé interdite : ${forbidden}`);
  }
});

test("brouillon : JSON corrompu, version inconnue ou vide → null", () => {
  const storage = memoryStorage();
  assert.equal(loadDraft(storage), null);
  storage.setItem(DRAFT_KEY, "{pas du json");
  assert.equal(loadDraft(storage), null);
  storage.setItem(DRAFT_KEY, JSON.stringify({ version: 99, config: {}, step: "identity", savedAt: "x" }));
  assert.equal(loadDraft(storage), null);
});

test("brouillon : champ corrompu → valeur par défaut, le reste est conservé", () => {
  const raw = { ...valid(), appearance: { templateId: "elegant", background: "pas-une-couleur" } };
  const { config, repaired } = sanitizeConfig(raw);
  assert.equal(repaired, true);
  assert.equal(config.appearance.templateId, "elegant");
  assert.match(config.appearance.background, /^#[0-9a-fA-F]{6}$/);
  assert.equal(config.identity.businessName, "Maison Lumière");

  const broken = sanitizeConfig({ identity: "n'importe quoi", appearance: 12 });
  assert.equal(broken.repaired, true);
  assert.equal(broken.config.program.mode, "stamps");
});

test("brouillon : saisie incomplète (nom vide, objectif hors bornes) conservée telle quelle", () => {
  const draft = defaultConfig();
  draft.program.stampsGoal = 2; // sous le minimum : l'utilisateur est en train de corriger
  const { config, repaired } = sanitizeConfig(draft);
  assert.equal(repaired, false);
  assert.equal(config.program.stampsGoal, 2);
  assert.equal(config.identity.businessName, "");
});

test("brouillon : logo invalide supprimé (type de données non autorisé)", () => {
  const draft = { ...valid(), logo: { dataUrl: "data:text/html;base64,PHNjcmlwdD4=", width: 10, height: 10, zoom: 1, offsetX: 0, offsetY: 0, shape: "circle" } };
  const { config, repaired } = sanitizeConfig(draft);
  assert.equal(config.logo, null);
  assert.equal(repaired, true);
});

test("brouillon : clearDraft supprime l'entrée", () => {
  const storage = memoryStorage();
  saveDraft(storage, valid(), "identity");
  clearDraft(storage);
  assert.equal(loadDraft(storage), null);
});

test("brouillon : stockage plein → saveDraft renvoie null sans lever d'erreur", () => {
  const storage: StorageLike = {
    getItem: () => null,
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
    removeItem: () => {},
  };
  assert.equal(saveDraft(storage, valid(), "identity"), null);
});

/* ---------- Logo ---------- */

test("logo : formats détectés par signature binaire", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
  const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
  const svg = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
  assert.equal(detectImageFormat(png), "png");
  assert.equal(detectImageFormat(jpg), "jpeg");
  assert.equal(detectImageFormat(webp), "webp");
  assert.equal(detectImageFormat(svg), null);
});

test("logo : taille maximale et fichier déguisé refusés", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(validateLogoBytes(png, 100).ok, true);
  const tooBig = validateLogoBytes(png, 3 * 1024 * 1024);
  assert.equal(tooBig.ok, false);
  const fake = validateLogoBytes(new TextEncoder().encode("MZ…exécutable"), 100);
  assert.equal(fake.ok, false);
  assert.equal(validateLogoBytes(new Uint8Array(), 0).ok, false);
});
