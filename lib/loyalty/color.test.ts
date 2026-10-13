import test from "node:test";
import assert from "node:assert/strict";

import {
  WCAG_AA_GRAPHIC,
  WCAG_AA_TEXT,
  contrastRatio,
  ensureContrast,
  evaluateContrast,
  hexToHsl,
  hslToHex,
  luminance,
  parseHex,
  readableOn,
  suggestPalettes,
  toHex,
} from "./color";

test("contraste noir/blanc = 21:1, identique = 1:1", () => {
  assert.ok(Math.abs(contrastRatio("#000000", "#FFFFFF") - 21) < 0.01);
  assert.ok(Math.abs(contrastRatio("#777777", "#777777") - 1) < 0.001);
});

test("valeur de référence WCAG : #767676 sur blanc ≈ 4,54:1", () => {
  const r = contrastRatio("#767676", "#FFFFFF");
  assert.ok(r > 4.5 && r < 4.6, String(r));
});

test("luminance des extrêmes", () => {
  assert.equal(luminance("#000000"), 0);
  assert.ok(Math.abs(luminance("#FFFFFF") - 1) < 1e-9);
});

test("parseHex / toHex aller-retour et rejet des formats invalides", () => {
  assert.deepEqual(parseHex("#FFC83D"), [255, 200, 61]);
  assert.equal(toHex([255, 200, 61]), "#FFC83D");
  assert.equal(parseHex("#FFF"), null);
  assert.equal(parseHex("rouge"), null);
});

test("HSL aller-retour (tolérance d'arrondi)", () => {
  for (const hex of ["#FFC83D", "#5B3DF5", "#0E1116", "#8A6A2F"]) {
    const back = hslToHex(hexToHsl(hex));
    assert.ok(contrastRatio(hex, back) < 1.05, `${hex} → ${back}`);
  }
});

test("readableOn choisit noir sur clair et blanc sur sombre", () => {
  assert.equal(readableOn("#FFFFFF"), "#111111");
  assert.equal(readableOn("#0E1116"), "#FFFFFF");
});

test("ensureContrast corrige un texte illisible et conserve un texte déjà bon", () => {
  const fixed = ensureContrast("#BBBBBB", "#FFFFFF", WCAG_AA_TEXT);
  assert.ok(contrastRatio(fixed, "#FFFFFF") >= WCAG_AA_TEXT);
  assert.equal(ensureContrast("#111111", "#FFFFFF"), "#111111");
  const onDark = ensureContrast("#333333", "#0E1116", WCAG_AA_TEXT);
  assert.ok(contrastRatio(onDark, "#0E1116") >= WCAG_AA_TEXT);
});

test("evaluateContrast signale un contraste insuffisant", () => {
  const bad = evaluateContrast({ background: "#FFFFFF", text: "#CCCCCC", accent: "#EEEEEE" });
  assert.equal(bad.find((c) => c.id === "text")!.level, "warning");
  assert.equal(bad.find((c) => c.id === "accent")!.level, "warning");
  const good = evaluateContrast({ background: "#FFFFFF", text: "#111111", accent: "#B00020" });
  assert.ok(good.every((c) => c.level === "ok"));
});

test("toutes les palettes suggérées respectent les seuils, quelle que soit la couleur de base", () => {
  for (const base of ["#FFC83D", "#5B3DF5", "#E4002B", "#00A86B", "#222222", "#FFFFFF", "invalide"]) {
    const palettes = suggestPalettes(base);
    assert.ok(palettes.length >= 4);
    for (const p of palettes) {
      assert.ok(contrastRatio(p.text, p.background) >= WCAG_AA_TEXT, `${base}/${p.id} texte`);
      assert.ok(contrastRatio(p.accent, p.background) >= WCAG_AA_GRAPHIC - 0.01, `${base}/${p.id} accent`);
      assert.match(p.background, /^#[0-9A-F]{6}$/);
    }
  }
});
