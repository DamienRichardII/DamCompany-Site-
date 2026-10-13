"use client";

import { useFormContext, useWatch } from "react-hook-form";
import form from "../form/Form.module.css";
import { Field } from "../form/Field";
import { LogoUploader } from "../form/LogoUploader";
import { LIMITS, SECTORS, type LoyaltyConfig } from "@/lib/loyalty/config";

export function IdentityStep() {
  const { register, control } = useFormContext<LoyaltyConfig>();
  const name = useWatch({ control, name: "identity.businessName" }) ?? "";

  return (
    <div>
      <h3 className={form.stepTitle}>Identité de votre commerce</h3>
      <p className={form.stepIntro}>
        Ces informations apparaissent sur la carte de vos clients. Seuls le nom et le secteur sont obligatoires.
      </p>

      <div className={form.stack}>
        <Field name="identity.businessName" label="Nom du commerce" counter={{ value: name.length, max: LIMITS.nameMax }}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="text"
              className={form.input}
              autoComplete="organization"
              placeholder="Ex. Maison Lumière"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              {...register("identity.businessName")}
            />
          )}
        </Field>

        <Field name="identity.sector" label="Secteur d'activité">
          {({ id, describedBy, invalid }) => (
            <select id={id} className={form.select} aria-invalid={invalid} aria-describedby={describedBy} {...register("identity.sector")}>
              {SECTORS.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <LogoUploader />

        <details className={form.details}>
          <summary>Coordonnées et site web (facultatif)</summary>
          <div className={form.stack} style={{ marginTop: 0 }}>
            <div className={form.row2}>
              <Field name="identity.phone" label="Téléphone" optional>
                {({ id, describedBy, invalid }) => (
                  <input id={id} type="tel" inputMode="tel" autoComplete="tel" className={form.input} placeholder="01 23 45 67 89" aria-invalid={invalid} aria-describedby={describedBy} {...register("identity.phone")} />
                )}
              </Field>
              <Field name="identity.email" label="E-mail" optional>
                {({ id, describedBy, invalid }) => (
                  <input id={id} type="email" inputMode="email" autoComplete="email" className={form.input} placeholder="contact@moncommerce.fr" aria-invalid={invalid} aria-describedby={describedBy} {...register("identity.email")} />
                )}
              </Field>
            </div>
            <Field name="identity.website" label="Adresse du site" optional hint="Ex. moncommerce.fr — http ou https uniquement.">
              {({ id, describedBy, invalid }) => (
                <input id={id} type="text" inputMode="url" autoComplete="url" className={form.input} placeholder="moncommerce.fr" aria-invalid={invalid} aria-describedby={describedBy} {...register("identity.website")} />
              )}
            </Field>
            <Field name="identity.address" label="Adresse" optional>
              {({ id, describedBy, invalid }) => (
                <input id={id} type="text" autoComplete="street-address" className={form.input} placeholder="12 rue des Lilas, 33000 Bordeaux" aria-invalid={invalid} aria-describedby={describedBy} {...register("identity.address")} />
              )}
            </Field>
          </div>
        </details>
      </div>
    </div>
  );
}
