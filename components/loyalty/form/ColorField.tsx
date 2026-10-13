"use client";

import { useId, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styles from "./ColorField.module.css";
import { isHex } from "@/lib/loyalty/color";
import type { LoyaltyConfig } from "@/lib/loyalty/config";

type ColorName = "appearance.background" | "appearance.text" | "appearance.accent";

export function ColorField({ name, label }: { name: ColorName; label: string }) {
  const { control } = useFormContext<LoyaltyConfig>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <ColorInput label={label} value={field.value} onChange={field.onChange} />}
    />
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  // Saisie texte locale : l'aperçu ne reçoit la couleur qu'une fois #RRGGBB complet.
  const [typed, setTyped] = useState<string | null>(null);
  const shown = typed ?? value;
  const invalid = typed !== null && !isHex(typed);

  return (
    <div className={styles.wrap}>
      <label htmlFor={`${id}-hex`} className={styles.label}>
        {label}
      </label>
      <div className={styles.controls} data-invalid={invalid}>
        <input
          type="color"
          className={styles.picker}
          aria-label={`${label} — sélecteur de couleur`}
          value={isHex(value) ? value.toLowerCase() : "#000000"}
          onChange={(event) => {
            setTyped(null);
            onChange(event.target.value.toUpperCase());
          }}
        />
        <input
          id={`${id}-hex`}
          type="text"
          className={styles.hex}
          value={shown}
          maxLength={7}
          spellCheck={false}
          autoCapitalize="characters"
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
          onChange={(event) => {
            let next = event.target.value.trim();
            if (next && !next.startsWith("#")) next = `#${next}`;
            setTyped(next);
            if (isHex(next)) onChange(next.toUpperCase());
          }}
          onBlur={() => setTyped(null)}
        />
      </div>
      {invalid ? (
        <span id={`${id}-err`} className={styles.error} role="alert">
          Format attendu : #RRGGBB
        </span>
      ) : null}
    </div>
  );
}
