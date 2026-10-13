"use client";

import { useId, type ReactNode } from "react";
import { useFormContext, type FieldErrors } from "react-hook-form";
import styles from "./Form.module.css";

/** Lit le message d'erreur RHF d'un chemin pointé (ex. "program.stampsGoal"). */
export function fieldError(errors: FieldErrors, name: string): string | undefined {
  let node: unknown = errors;
  for (const part of name.split(".")) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  const message = (node as { message?: unknown } | undefined)?.message;
  return typeof message === "string" ? message : undefined;
}

type FieldProps = {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
  /** Affiche un compteur « n / max » sous le champ. */
  counter?: { value: number; max: number };
  children: (control: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

export function Field({ name, label, hint, optional, counter, children }: FieldProps) {
  const id = useId();
  const {
    formState: { errors },
  } = useFormContext();
  const error = fieldError(errors, name);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field} data-invalid={Boolean(error)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}> · facultatif</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      <div className={styles.meta}>
        <span>
          {error ? (
            <span id={errorId} className={styles.error} role="alert">
              {error}
            </span>
          ) : hint ? (
            <span id={hintId} className={styles.hint}>
              {hint}
            </span>
          ) : null}
        </span>
        {counter ? (
          <span className={styles.counter} data-over={counter.value > counter.max}>
            {counter.value} / {counter.max}
          </span>
        ) : null}
      </div>
    </div>
  );
}
