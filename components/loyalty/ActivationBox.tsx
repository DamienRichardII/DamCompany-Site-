"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Send, TriangleAlert } from "lucide-react";
import styles from "./ActivationBox.module.css";
import form from "./form/Form.module.css";
import { Field } from "./form/Field";
import {
  activationContactSchema,
  type ActivationContact,
  type ActivationResponse,
} from "@/lib/loyalty/activation-schema";
import type { LoyaltyConfig } from "@/lib/loyalty/config";
import type { LoyaltyPricing } from "@/lib/loyalty/pricing";

type ActivationBoxProps = {
  /** Demandes d'activation réellement transmises (service e-mail configuré côté serveur). */
  requestsEnabled: boolean;
  pricing: LoyaltyPricing | null;
  /** La configuration est-elle complète et valide ? */
  ready: boolean;
  getConfig: () => LoyaltyConfig;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done" }
  | { kind: "error"; message: string };

/**
 * Bloc d'activation. Il ne présente que des actions RÉELLES :
 * - service de demande configuré → formulaire qui transmet vraiment la demande ;
 * - sinon → message clair « bientôt disponible », sans fausse action.
 * Aucun paiement, aucun fichier Wallet, aucun enregistrement n'est simulé.
 */
export function ActivationBox({ requestsEnabled, pricing, ready, getConfig }: ActivationBoxProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const methods = useForm<ActivationContact>({
    resolver: zodResolver(activationContactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", consent: undefined, companyWebsite: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (contact) => {
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/loyalty/activation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, config: getConfig() }),
      });
      const data = (await response.json().catch(() => null)) as ActivationResponse | null;
      if (response.ok && data?.ok) {
        setState({ kind: "done" });
        return;
      }
      setState({
        kind: "error",
        message:
          data && !data.ok
            ? data.message
            : "La demande n'a pas pu être transmise. Réessayez dans quelques instants.",
      });
    } catch {
      setState({ kind: "error", message: "Connexion impossible. Vérifiez votre réseau puis réessayez." });
    }
  });

  return (
    <section className={styles.box} aria-labelledby="activation-title">
      <h4 id="activation-title" className={styles.title}>
        Activer votre programme
      </h4>
      <p className={styles.text}>
        La personnalisation est gratuite. L&apos;activation vous donne le lien d&apos;inscription et le QR code
        public de votre commerce, que vos clients scannent pour rejoindre le programme.
      </p>

      {pricing ? (
        <p className={styles.price}>
          <strong>{pricing.amountLabel}</strong> {pricing.detail ?? ""} — {pricing.label}
        </p>
      ) : null}

      {!requestsEnabled ? (
        <div className={styles.soon} role="status">
          <Clock size={18} aria-hidden="true" />
          <div>
            <strong>Activation en ligne : bientôt disponible.</strong>
            <p>
              Le paiement et la demande d&apos;activation ne sont pas encore ouverts. Votre carte reste
              enregistrée dans ce navigateur : vous pourrez la retrouver ici telle que vous l&apos;avez
              configurée.
            </p>
          </div>
        </div>
      ) : state.kind === "done" ? (
        <div className={styles.done} role="status">
          <CheckCircle2 size={20} aria-hidden="true" />
          <div>
            <strong>Demande transmise.</strong>
            <p>Nous revenons vers vous pour finaliser l&apos;activation de votre programme.</p>
          </div>
        </div>
      ) : !open ? (
        <div>
          <button type="button" className={`${form.btn} ${form.btnPrimary}`} onClick={() => setOpen(true)} disabled={!ready}>
            Demander l&apos;activation
          </button>
          {!ready ? <p className={styles.helper}>Complétez les éléments signalés ci-dessus pour demander l&apos;activation.</p> : null}
        </div>
      ) : (
        <FormProvider {...methods}>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={form.row2}>
            <Field name="name" label="Votre nom">
              {({ id, describedBy, invalid }) => (
                <input id={id} type="text" autoComplete="name" className={form.input} aria-invalid={invalid} aria-describedby={describedBy} {...register("name")} />
              )}
            </Field>
            <Field name="email" label="E-mail">
              {({ id, describedBy, invalid }) => (
                <input id={id} type="email" autoComplete="email" inputMode="email" className={form.input} aria-invalid={invalid} aria-describedby={describedBy} {...register("email")} />
              )}
            </Field>
          </div>
          <Field name="phone" label="Téléphone" optional>
            {({ id, describedBy, invalid }) => (
              <input id={id} type="tel" autoComplete="tel" inputMode="tel" className={form.input} aria-invalid={invalid} aria-describedby={describedBy} {...register("phone")} />
            )}
          </Field>
          <Field name="message" label="Un mot pour nous" optional>
            {({ id, describedBy, invalid }) => (
              <textarea id={id} rows={3} className={form.textarea} aria-invalid={invalid} aria-describedby={describedBy} {...register("message")} />
            )}
          </Field>

          {/* Champ piège anti-spam : invisible pour les humains */}
          <div className={styles.trap} aria-hidden="true">
            <label>
              Ne pas remplir
              <input type="text" tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
            </label>
          </div>

          <div className={styles.consent} data-invalid={Boolean(errors.consent)}>
            <label className={styles.consentLabel}>
              <input type="checkbox" {...register("consent")} />
              <span>
                J&apos;accepte que DamCompany utilise ces informations et la configuration de ma carte pour me
                répondre au sujet de l&apos;activation.
              </span>
            </label>
            {errors.consent ? (
              <span className={form.error} role="alert">
                {errors.consent.message as string}
              </span>
            ) : null}
          </div>

          {state.kind === "error" ? (
            <p className={styles.error} role="alert">
              <TriangleAlert size={16} aria-hidden="true" /> {state.message}
            </p>
          ) : null}

          <div className={styles.actions}>
            <button type="submit" className={`${form.btn} ${form.btnPrimary}`} disabled={state.kind === "sending"}>
              <Send size={15} aria-hidden="true" />
              {state.kind === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
            <button type="button" className={`${form.btn} ${form.btnQuiet}`} onClick={() => setOpen(false)}>
              Annuler
            </button>
          </div>
        </form>
        </FormProvider>
      )}
    </section>
  );
}
