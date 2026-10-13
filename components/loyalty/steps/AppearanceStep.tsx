"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CheckCircle2, TriangleAlert, Wand2 } from "lucide-react";
import form from "../form/Form.module.css";
import styles from "./AppearanceStep.module.css";
import { ColorField } from "../form/ColorField";
import {
  TEMPLATES,
  TEMPLATE_IDS,
  type LoyaltyConfig,
  type TemplateId,
} from "@/lib/loyalty/config";
import { ensureContrast, evaluateContrast, isHex, suggestPalettes, WCAG_AA_GRAPHIC, WCAG_AA_TEXT, type Palette } from "@/lib/loyalty/color";

export function AppearanceStep() {
  const { setValue, control } = useFormContext<LoyaltyConfig>();
  const appearance = useWatch({ control, name: "appearance" });
  const logo = useWatch({ control, name: "logo" });

  const colors = {
    background: isHex(appearance.background) ? appearance.background : "#FFFFFF",
    text: isHex(appearance.text) ? appearance.text : "#111111",
    accent: isHex(appearance.accent) ? appearance.accent : "#111111",
  };
  const checks = evaluateContrast(colors);
  const hasWarning = checks.some((c) => c.level === "warning");

  const base = logo?.dominant ?? colors.accent;
  const palettes = suggestPalettes(base);

  const setAppearance = (next: Partial<LoyaltyConfig["appearance"]>) =>
    setValue("appearance", { ...appearance, ...next }, { shouldDirty: true, shouldValidate: true });

  const applyTemplate = (id: TemplateId) =>
    setAppearance({ templateId: id, ...TEMPLATES[id].colors });

  const applyPalette = (palette: Palette) =>
    setAppearance({ background: palette.background, text: palette.text, accent: palette.accent });

  const autoFix = () =>
    setAppearance({
      text: ensureContrast(colors.text, colors.background, WCAG_AA_TEXT),
      accent: ensureContrast(colors.accent, colors.background, WCAG_AA_GRAPHIC),
    });

  return (
    <div>
      <h3 className={form.stepTitle}>Apparence de la carte</h3>
      <p className={form.stepIntro}>
        Choisissez un modèle, puis ajustez les couleurs. L&apos;aperçu se met à jour instantanément.
      </p>

      <div className={form.stack}>
        <div className={form.group}>
          <p className={form.groupTitle} id="templates-label">
            Modèle
          </p>
          <div className={form.choiceGrid} data-cols="4" role="radiogroup" aria-labelledby="templates-label">
            {TEMPLATE_IDS.map((id) => {
              const tpl = TEMPLATES[id];
              const selected = appearance.templateId === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={form.choice}
                  onClick={() => applyTemplate(id)}
                >
                  <span className={form.swatch} style={{ background: tpl.colors.background }}>
                    <span className={form.swatchLine} style={{ background: tpl.colors.text, opacity: 0.85 }} />
                    <span className={form.swatchDot} style={{ background: tpl.colors.accent }} />
                  </span>
                  <span className={form.choiceTitle}>{tpl.label}</span>
                  <span className={form.choiceText}>{tpl.description}</span>
                </button>
              );
            })}
          </div>
          <p className={form.hint}>Changer de modèle remet les couleurs du modèle ; vous pouvez ensuite les modifier.</p>
        </div>

        <div className={form.group}>
          <p className={form.groupTitle}>Couleurs</p>
          <div className={styles.colors}>
            <ColorField name="appearance.background" label="Fond" />
            <ColorField name="appearance.text" label="Textes" />
            <ColorField name="appearance.accent" label="Accent (tampons, progression)" />
          </div>

          <ul className={styles.checks} aria-label="Lisibilité des couleurs">
            {checks.map((check) => (
              <li key={check.id} className={styles.check} data-level={check.level}>
                {check.level === "ok" ? <CheckCircle2 size={17} aria-hidden="true" /> : <TriangleAlert size={17} aria-hidden="true" />}
                <span>
                  <strong>{check.label}.</strong> {check.message}
                </span>
              </li>
            ))}
          </ul>
          {hasWarning ? (
            <div>
              <button type="button" className={`${form.btn} ${form.btnDark} ${form.btnSmall}`} onClick={autoFix}>
                <Wand2 size={15} aria-hidden="true" /> Corriger automatiquement
              </button>
            </div>
          ) : null}
        </div>

        <div className={form.group}>
          <p className={form.groupTitle}>Palettes suggérées</p>
          <p className={form.groupText}>
            Construites autour de {logo?.dominant ? "la couleur de votre logo" : "votre couleur d'accent"}, avec un contraste
            vérifié.
          </p>
          <div className={styles.palettes}>
            {palettes.map((palette) => (
              <button key={palette.id} type="button" className={styles.palette} onClick={() => applyPalette(palette)} aria-label={`Appliquer la palette ${palette.name}`}>
                <span className={styles.paletteSwatch} style={{ background: palette.background }}>
                  <span style={{ background: palette.text }} />
                  <span style={{ background: palette.accent }} />
                </span>
                <span className={styles.paletteName}>{palette.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
