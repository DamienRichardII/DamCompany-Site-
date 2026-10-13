"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CheckCircle2, CircleAlert, Pencil } from "lucide-react";
import form from "../form/Form.module.css";
import styles from "./RecapStep.module.css";
import { ActivationBox } from "../ActivationBox";
import { SECTORS, TEMPLATES, configSchema, toPreviewModel, type LoyaltyConfig, type StepId } from "@/lib/loyalty/config";
import { evaluateContrast, isHex } from "@/lib/loyalty/color";
import type { LoyaltyPricing } from "@/lib/loyalty/pricing";

type RecapStepProps = {
  onEdit: (step: StepId) => void;
  activationEnabled: boolean;
  pricing: LoyaltyPricing | null;
};

const STEP_BY_SECTION: Record<string, StepId> = {
  identity: "identity",
  logo: "identity",
  appearance: "appearance",
  program: "program",
};

export function RecapStep({ onEdit, activationEnabled, pricing }: RecapStepProps) {
  const { control, getValues } = useFormContext<LoyaltyConfig>();
  const values = useWatch({ control }) as LoyaltyConfig;
  const model = toPreviewModel(values);

  const parsed = configSchema.safeParse(values);
  const issues = parsed.success
    ? []
    : parsed.error.issues.map((issue) => ({
        step: STEP_BY_SECTION[String(issue.path[0])] ?? "identity",
        message: issue.message,
      }));
  const ready = parsed.success;

  const sector = SECTORS.find((s) => s.id === values.identity?.sector)?.label ?? "—";
  const contactCount = ["phone", "email", "website", "address"].filter(
    (key) => (values.identity?.[key as "phone"] ?? "").trim() !== ""
  ).length;
  const colorsOk = isHex(values.appearance.background) && isHex(values.appearance.text) && isHex(values.appearance.accent);
  const contrastOk = colorsOk ? evaluateContrast(model.colors).every((c) => c.level === "ok") : false;

  return (
    <div>
      <h3 className={form.stepTitle}>Récapitulatif</h3>
      <p className={form.stepIntro}>Vérifiez votre carte avant de demander l&apos;activation. Chaque bloc se modifie en un clic.</p>

      <div className={form.stack}>
        <div className={styles.banner} data-ready={ready} role="status">
          {ready ? <CheckCircle2 size={20} aria-hidden="true" /> : <CircleAlert size={20} aria-hidden="true" />}
          <div>
            <strong>{ready ? "Votre carte est prête." : "Quelques éléments sont à compléter."}</strong>
            {!ready ? (
              <ul className={styles.issues}>
                {issues.map((issue, index) => (
                  <li key={`${issue.step}-${index}`}>
                    {issue.message}{" "}
                    <button type="button" className={styles.link} onClick={() => onEdit(issue.step)}>
                      Corriger
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className={styles.grid}>
          <SummaryCard title="Identité" onEdit={() => onEdit("identity")}>
            <Row label="Commerce" value={model.hasName ? model.name : "—"} />
            <Row label="Secteur" value={sector} />
            <Row label="Logo" value={values.logo ? "Importé" : "Aucun (initiale affichée)"} />
            <Row label="Coordonnées" value={contactCount ? `${contactCount} renseignée${contactCount > 1 ? "s" : ""}` : "Aucune"} />
          </SummaryCard>

          <SummaryCard title="Apparence" onEdit={() => onEdit("appearance")}>
            <Row label="Modèle" value={TEMPLATES[model.template.id].label} />
            <Row
              label="Couleurs"
              value={
                <span className={styles.swatches} aria-label="Fond, textes, accent">
                  {[model.colors.background, model.colors.text, model.colors.accent].map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </span>
              }
            />
            <Row label="Lisibilité" value={contrastOk ? "Conforme" : "À vérifier"} />
          </SummaryCard>

          <SummaryCard title="Programme" onEdit={() => onEdit("program")}>
            <Row label="Mode" value={model.mode === "stamps" ? "Passages / tampons" : "Points"} />
            <Row
              label="Objectif"
              value={model.mode === "stamps" ? `${model.goal} tampons` : `${model.goal.toLocaleString("fr-FR")} points`}
            />
            <Row label="Récompense" value={model.hasReward ? model.rewardLabel : "—"} />
            <Row label="Conditions" value={(getValues("program.conditions") ?? "").trim() ? "Renseignées" : "Aucune"} />
          </SummaryCard>
        </div>

        <aside className={styles.qr} aria-label="Les deux QR codes">
          <p className={styles.qrTitle}>Après l&apos;activation : deux QR codes, deux rôles</p>
          <div className={styles.qrGrid}>
            <div>
              <strong>QR code public du commerce</strong>
              <p>Affiché en boutique. Vos clients le scannent pour rejoindre gratuitement le programme.</p>
            </div>
            <div>
              <strong>QR code individuel d&apos;un adhérent</strong>
              <p>Sur la carte de chaque client. Il vous permet de retrouver sa carte. Le scanner ne crédite jamais la carte.</p>
            </div>
          </div>
        </aside>

        <ActivationBox
          requestsEnabled={activationEnabled}
          pricing={pricing}
          ready={ready}
          getConfig={() => getValues()}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <h4>{title}</h4>
        <button type="button" className={`${form.btn} ${form.btnGhost} ${form.btnSmall}`} onClick={onEdit} aria-label={`Modifier ${title.toLowerCase()}`}>
          <Pencil size={13} aria-hidden="true" /> Modifier
        </button>
      </div>
      <dl className={styles.list}>{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
