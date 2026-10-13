"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Stamp, Coins } from "lucide-react";
import form from "../form/Form.module.css";
import { Field } from "../form/Field";
import { LIMITS, suggestedConditions, type LoyaltyConfig, type LoyaltyMode, type SectorId } from "@/lib/loyalty/config";

/** Suggestions de récompenses à adapter — simples exemples de libellés, jamais imposés. */
const REWARD_IDEAS: Record<SectorId, string[]> = {
  "cafe-restaurant": ["Un café offert", "Un dessert offert"],
  boulangerie: ["Une viennoiserie offerte", "Une baguette offerte"],
  "coiffure-beaute": ["Un soin offert", "Une remise sur la prestation suivante"],
  boutique: ["Un cadeau surprise", "Une remise sur votre prochain achat"],
  "bien-etre-sport": ["Une séance offerte", "Une séance d'essai pour un proche"],
  services: ["Une prestation offerte", "Une remise sur la prochaine prestation"],
  autre: ["Un cadeau offert", "Une remise sur votre prochain achat"],
};

export function ProgramStep() {
  const { register, control, setValue } = useFormContext<LoyaltyConfig>();
  const mode = useWatch({ control, name: "program.mode" });
  const sector = useWatch({ control, name: "identity.sector" });
  const reward = useWatch({ control, name: "program.rewardLabel" }) ?? "";
  const conditions = useWatch({ control, name: "program.conditions" }) ?? "";
  const ideas = REWARD_IDEAS[sector] ?? REWARD_IDEAS.autre;

  // Change de mode ; si les conditions sont encore le texte suggéré de l'autre mode
  // (ou vides), on les adapte — un texte personnalisé n'est jamais écrasé.
  const switchMode = (next: LoyaltyMode, onChange: (value: LoyaltyMode) => void) => {
    const other: LoyaltyMode = next === "stamps" ? "points" : "stamps";
    if (conditions.trim() === "" || conditions === suggestedConditions(other)) {
      setValue("program.conditions", suggestedConditions(next), { shouldDirty: true });
    }
    onChange(next);
  };

  return (
    <div>
      <h3 className={form.stepTitle}>Votre programme de fidélité</h3>
      <p className={form.stepIntro}>Choisissez comment vos clients gagnent leur récompense.</p>

      <div className={form.stack}>
        <Controller
          control={control}
          name="program.mode"
          render={({ field }) => (
            <div className={form.group}>
              <p className={form.groupTitle} id="mode-label">
                Mode de fidélité
              </p>
              <div className={form.choiceGrid} role="radiogroup" aria-labelledby="mode-label">
                <button type="button" role="radio" aria-checked={field.value === "stamps"} className={form.choice} onClick={() => switchMode("stamps", field.onChange)}>
                  <Stamp size={22} aria-hidden="true" />
                  <span className={form.choiceTitle}>Passages / tampons</span>
                  <span className={form.choiceText}>Un tampon par passage. Simple et visuel.</span>
                </button>
                <button type="button" role="radio" aria-checked={field.value === "points"} className={form.choice} onClick={() => switchMode("points", field.onChange)}>
                  <Coins size={22} aria-hidden="true" />
                  <span className={form.choiceTitle}>Points</span>
                  <span className={form.choiceText}>Des points selon les achats. Plus flexible.</span>
                </button>
              </div>
            </div>
          )}
        />

        {mode === "stamps" ? (
          <Field
            name="program.stampsGoal"
            label="Nombre de tampons pour obtenir la récompense"
            hint={`Entre ${LIMITS.stampsMin} et ${LIMITS.stampsMax}.`}
          >
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min={LIMITS.stampsMin}
                max={LIMITS.stampsMax}
                step={1}
                className={form.input}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                {...register("program.stampsGoal", { valueAsNumber: true })}
              />
            )}
          </Field>
        ) : (
          <div className={form.row2}>
            <Field name="program.pointsGoal" label="Points à atteindre" hint={`Entre ${LIMITS.pointsMin} et ${LIMITS.pointsMax.toLocaleString("fr-FR")}.`}>
              {({ id, describedBy, invalid }) => (
                <input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={LIMITS.pointsMin}
                  max={LIMITS.pointsMax}
                  step={1}
                  className={form.input}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  {...register("program.pointsGoal", { valueAsNumber: true })}
                />
              )}
            </Field>
            <Field name="program.pointsPerEuro" label="Points gagnés par euro dépensé" hint="Ex. 1 pour 1 € = 1 point.">
              {({ id, describedBy, invalid }) => (
                <input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={LIMITS.pointsPerEuroMax}
                  step={1}
                  className={form.input}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  {...register("program.pointsPerEuro", { valueAsNumber: true })}
                />
              )}
            </Field>
          </div>
        )}

        <div className={form.group}>
          <Field name="program.rewardLabel" label="Récompense" counter={{ value: reward.length, max: LIMITS.rewardMax }}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                type="text"
                className={form.input}
                placeholder={ideas[0]}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                {...register("program.rewardLabel")}
              />
            )}
          </Field>
          <div className={form.chips} aria-label="Idées de récompenses à adapter">
            {ideas.map((idea) => (
              <button
                key={idea}
                type="button"
                className={form.chip}
                onClick={() => setValue("program.rewardLabel", idea, { shouldDirty: true, shouldValidate: true })}
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        <div className={form.group}>
          <Field
            name="program.conditions"
            label="Conditions du programme"
            optional
            counter={{ value: conditions.length, max: LIMITS.conditionsMax }}
            hint="Affichées aux clients lors de leur inscription."
          >
            {({ id, describedBy, invalid }) => (
              <textarea id={id} className={form.textarea} rows={4} aria-invalid={invalid} aria-describedby={describedBy} {...register("program.conditions")} />
            )}
          </Field>
          <div>
            <button
              type="button"
              className={`${form.btn} ${form.btnQuiet}`}
              onClick={() => setValue("program.conditions", suggestedConditions(mode), { shouldDirty: true, shouldValidate: true })}
            >
              Rétablir le texte suggéré
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
