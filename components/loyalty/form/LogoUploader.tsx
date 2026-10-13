"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ImagePlus, TriangleAlert, Trash2, Undo2 } from "lucide-react";
import styles from "./LogoUploader.module.css";
import form from "./Form.module.css";
import { processLogoFile } from "@/lib/loyalty/logo";
import type { LogoConfig, LoyaltyConfig } from "@/lib/loyalty/config";

type Status = { kind: "idle" } | { kind: "ok"; message: string } | { kind: "error"; message: string };

export function LogoUploader() {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setValue, control } = useFormContext<LoyaltyConfig>();
  const logo = useWatch({ control, name: "logo" }) as LogoConfig | null;
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const update = (patch: Partial<LogoConfig>) => {
    if (!logo) return;
    setValue("logo", { ...logo, ...patch }, { shouldDirty: true, shouldValidate: true });
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setStatus({ kind: "idle" });
    const result = await processLogoFile(file);
    setBusy(false);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    const { bytes, ...stored } = result.logo;
    setValue(
      "logo",
      { ...stored, zoom: 1, offsetX: 0, offsetY: 0, shape: logo?.shape ?? "circle" },
      { shouldDirty: true, shouldValidate: true }
    );
    const kb = Math.max(1, Math.round(bytes / 1024));
    setStatus({
      kind: "ok",
      message: `Logo importé · ${result.logo.width}×${result.logo.height} px · ${kb} Ko${
        result.logo.dominant ? " · couleur de marque repérée (voir les palettes suggérées)" : ""
      }`,
    });
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  };

  const remove = () => {
    setValue("logo", null, { shouldDirty: true, shouldValidate: true });
    setStatus({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={form.group}>
      <p className={form.groupTitle}>
        Logo <span className={form.optional}>· facultatif</span>
      </p>

      <label
        htmlFor={`${id}-file`}
        className={styles.drop}
        data-dragging={dragging}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <ImagePlus size={22} aria-hidden="true" />
        <span className={styles.dropText}>
          <strong>{busy ? "Traitement du logo…" : logo ? "Remplacer le logo" : "Importer votre logo"}</strong>
          <span>PNG, JPEG ou WebP · 2 Mo maximum · 64 px minimum</span>
        </span>
      </label>
      <input
        ref={inputRef}
        id={`${id}-file`}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className={styles.file}
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      <div aria-live="polite" className={styles.live}>
        <AnimatePresence mode="wait">
          {status.kind !== "idle" ? (
            <motion.p
              key={status.message}
              className={status.kind === "ok" ? styles.ok : styles.err}
              role={status.kind === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {status.kind === "ok" ? <CheckCircle2 size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
              <span>{status.message}</span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {logo ? (
        <div className={styles.adjust}>
          <div className={styles.viewport} data-shape={logo.shape} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL locale */}
            <img
              src={logo.dataUrl}
              alt=""
              className={styles.viewImg}
              style={{ transform: `translate(${logo.offsetX}%, ${logo.offsetY}%) scale(${logo.zoom})` }}
            />
          </div>

          <div className={styles.controls}>
            <Slider label="Zoom" value={logo.zoom} min={1} max={3} step={0.05} format={(v) => `${Math.round(v * 100)} %`} onChange={(v) => update({ zoom: v })} />
            <Slider label="Position horizontale" value={logo.offsetX} min={-50} max={50} step={1} format={(v) => `${v}`} onChange={(v) => update({ offsetX: v })} />
            <Slider label="Position verticale" value={logo.offsetY} min={-50} max={50} step={1} format={(v) => `${v}`} onChange={(v) => update({ offsetY: v })} />

            <fieldset className={styles.shape}>
              <legend className={form.label}>Forme du cadre</legend>
              {(
                [
                  ["circle", "Rond"],
                  ["rounded", "Arrondi"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={styles.radio}>
                  <input type="radio" name={`${id}-shape`} checked={logo.shape === value} onChange={() => update({ shape: value })} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            <div className={styles.buttons}>
              <button type="button" className={`${form.btn} ${form.btnGhost} ${form.btnSmall}`} onClick={() => update({ zoom: 1, offsetX: 0, offsetY: 0 })}>
                <Undo2 size={15} aria-hidden="true" /> Recentrer
              </button>
              <button type="button" className={`${form.btn} ${form.btnGhost} ${form.btnSmall}`} onClick={remove}>
                <Trash2 size={15} aria-hidden="true" /> Retirer le logo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className={styles.slider}>
      <label htmlFor={id} className={form.label}>
        {label} <output htmlFor={id} className={styles.output}>{format(value)}</output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}
