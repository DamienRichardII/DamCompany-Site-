/**
 * Utilitaires couleur du configurateur de carte de fidélité :
 * contraste WCAG 2.x, correction automatique, suggestions de palettes.
 * Aucune dépendance — fonctions pures, testées (color.test.ts).
 */

export type RGB = [number, number, number];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function isHex(value: string): boolean {
  return HEX_RE.test(value);
}

export function parseHex(hex: string): RGB | null {
  if (!isHex(hex)) return null;
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function toHex([r, g, b]: RGB): string {
  const part = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

/** Luminance relative WCAG (0 = noir, 1 = blanc). */
export function luminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapport de contraste WCAG entre deux couleurs hex (1 à 21). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const WCAG_AA_TEXT = 4.5;
export const WCAG_AA_GRAPHIC = 3;

/** Couleur de texte (noir ou blanc) la plus lisible sur un fond donné. */
export function readableOn(background: string): string {
  return contrastRatio("#111111", background) >= contrastRatio("#FFFFFF", background)
    ? "#111111"
    : "#FFFFFF";
}

/* ---------- HSL ---------- */

export type HSL = [number, number, number]; // h 0-360, s 0-100, l 0-100

export function hexToHsl(hex: string): HSL {
  const rgb = parseHex(hex) ?? [0, 0, 0];
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

export function hslToHex([h, s, l]: HSL): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s)) / 100;
  const ll = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = ll - c / 2;
  let rgb: RGB;
  if (hh < 60) rgb = [c, x, 0];
  else if (hh < 120) rgb = [x, c, 0];
  else if (hh < 180) rgb = [0, c, x];
  else if (hh < 240) rgb = [0, x, c];
  else if (hh < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return toHex([(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255]);
}

/**
 * Ajuste la clarté de `fg` (teinte conservée) jusqu'à atteindre `min` de
 * contraste sur `bg`. Repli sur noir/blanc si la teinte ne peut pas y arriver.
 */
export function ensureContrast(fg: string, bg: string, min: number = WCAG_AA_TEXT): string {
  if (!isHex(fg) || !isHex(bg)) return fg;
  if (contrastRatio(fg, bg) >= min) return fg;

  const [h, s, l] = hexToHsl(fg);
  const darken = luminance(bg) > 0.4;
  for (let step = 1; step <= 50; step += 1) {
    const candidate = hslToHex([h, s, l + (darken ? -step : step) * 2]);
    if (contrastRatio(candidate, bg) >= min) return candidate;
  }
  const fallback = readableOn(bg);
  return contrastRatio(fallback, bg) >= min ? fallback : fg;
}

/* ---------- Évaluation de lisibilité ---------- */

export type ContrastLevel = "ok" | "warning";

export type ContrastCheck = {
  id: "text" | "accent";
  label: string;
  ratio: number;
  required: number;
  level: ContrastLevel;
  message: string;
};

export type ColorSet = { background: string; text: string; accent: string };

export function evaluateContrast({ background, text, accent }: ColorSet): ContrastCheck[] {
  const textRatio = contrastRatio(text, background);
  const accentRatio = contrastRatio(accent, background);
  const fmt = (n: number) => n.toFixed(1).replace(".", ",");

  return [
    {
      id: "text",
      label: "Texte sur fond",
      ratio: textRatio,
      required: WCAG_AA_TEXT,
      level: textRatio >= WCAG_AA_TEXT ? "ok" : "warning",
      message:
        textRatio >= WCAG_AA_TEXT
          ? `Contraste ${fmt(textRatio)}:1 — texte bien lisible.`
          : `Contraste ${fmt(textRatio)}:1 — insuffisant. Visez au moins 4,5:1 pour que le texte reste lisible.`,
    },
    {
      id: "accent",
      label: "Accent sur fond",
      ratio: accentRatio,
      required: WCAG_AA_GRAPHIC,
      level: accentRatio >= WCAG_AA_GRAPHIC ? "ok" : "warning",
      message:
        accentRatio >= WCAG_AA_GRAPHIC
          ? `Contraste ${fmt(accentRatio)}:1 — tampons et barres bien visibles.`
          : `Contraste ${fmt(accentRatio)}:1 — les tampons et la progression seront peu visibles (minimum conseillé 3:1).`,
    },
  ];
}

/* ---------- Suggestions de palettes ---------- */

export type Palette = ColorSet & { id: string; name: string };

/**
 * Palettes harmonieuses construites autour d'une couleur de base. Chaque
 * palette respecte par construction les seuils de contraste ci-dessus.
 */
export function suggestPalettes(base: string): Palette[] {
  const safeBase = isHex(base) ? base : "#2F6FED";
  const [h, s] = hexToHsl(safeBase);
  const sat = Math.max(35, Math.min(85, s));

  const make = (id: string, name: string, background: string, textSeed: string, accentSeed: string): Palette => ({
    id,
    name,
    background,
    text: ensureContrast(textSeed, background, WCAG_AA_TEXT),
    accent: ensureContrast(accentSeed, background, WCAG_AA_GRAPHIC),
  });

  const lightBg = hslToHex([h, 30, 96]);
  const darkBg = hslToHex([h, 35, 9]);
  const compBg = hslToHex([h + 180, 22, 95]);
  const analogBg = hslToHex([h + 30, 45, 92]);
  const boldBg = ensureContrast(hslToHex([h, sat, 38]), "#FFFFFF", 4.5);

  return [
    make("mono-clair", "Monochrome clair", lightBg, hslToHex([h, 35, 12]), safeBase),
    make("mono-sombre", "Monochrome sombre", darkBg, hslToHex([h, 20, 95]), safeBase),
    make("complementaire", "Complémentaire", compBg, hslToHex([h + 180, 30, 14]), safeBase),
    make("analogue", "Analogue", analogBg, hslToHex([h + 30, 40, 13]), hslToHex([h - 25, sat, 45])),
    make("franc", "Contraste franc", boldBg, "#FFFFFF", hslToHex([h + 180, 85, 70])),
  ];
}
