"use client";

import type { CSSProperties } from "react";
import { Info } from "lucide-react";
import styles from "./WalletPass.module.css";
import { FakeQr } from "./FakeQr";
import { progressLabel, type PreviewModel } from "@/lib/loyalty/config";
import { contrastRatio, readableOn } from "@/lib/loyalty/color";

/**
 * Aperçu APPROXIMATIF d'une carte Apple Wallet (type « storeCard »).
 *
 * Apple impose le gabarit : couleur de fond unie, logo dans une zone fixe,
 * champs texte, un seul code-barres. Le design web (motifs, dégradés,
 * animations, tampons dessinés, typographies) n'est PAS reproduit à
 * l'identique. Adhérent et progression sont fictifs.
 */
export function WalletPass({ model }: { model: PreviewModel }) {
  const { colors, logo } = model;
  // Wallet : labelColor et foregroundColor sont indépendants du design web.
  const label =
    contrastRatio(colors.accent, colors.background) >= 3 ? colors.accent : `${colors.text}B3`;
  const barcodeBg = "#FFFFFF";

  const vars = {
    "--wp-bg": colors.background,
    "--wp-fg": colors.text,
    "--wp-label": label,
    "--wp-accent": colors.accent,
    "--wp-on-accent": readableOn(colors.accent),
  } as CSSProperties;

  const primaryLabel = model.mode === "stamps" ? "TAMPONS" : "POINTS";
  const primaryValue =
    model.mode === "stamps"
      ? `${model.progress} / ${model.goal}`
      : `${model.progress.toLocaleString("fr-FR")} / ${model.goal.toLocaleString("fr-FR")}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.pass} style={vars} role="img" aria-label={`Aperçu approximatif de la carte Apple Wallet de ${model.name}. ${progressLabel(model)}. Adhérent fictif.`}>
        <div className={styles.header} aria-hidden="true">
          <span className={styles.logoBox}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL locale
              <img src={logo.dataUrl} alt="" className={styles.logoImg} />
            ) : (
              <span className={styles.logoFallback}>{model.name.charAt(0).toUpperCase()}</span>
            )}
          </span>
          <span className={styles.orgName}>{model.name}</span>
          <span className={styles.headerField}>
            <span className={styles.label}>PROGRESSION</span>
            <span className={styles.value}>{Math.round((model.progress / model.goal) * 100)} %</span>
          </span>
        </div>

        <div className={styles.primary} aria-hidden="true">
          <span className={styles.label}>{primaryLabel}</span>
          <span className={styles.primaryValue}>{primaryValue}</span>
        </div>

        <div className={styles.secondary} aria-hidden="true">
          <span>
            <span className={styles.label}>RÉCOMPENSE</span>
            <span className={styles.value}>{model.rewardLabel}</span>
          </span>
          <span className={styles.right}>
            <span className={styles.label}>ADHÉRENT</span>
            <span className={styles.value}>Camille D.</span>
          </span>
        </div>

        <div className={styles.barcode} style={{ background: barcodeBg }} aria-hidden="true">
          <FakeQr className={styles.qr} />
          <span className={styles.barcodeCaption}>QR individuel de l&apos;adhérent</span>
        </div>

        <span className={styles.tag}>Aperçu</span>
      </div>

      <p className={styles.note}>
        <Info size={15} aria-hidden="true" />
        <span>
          <strong>Aperçu approximatif.</strong> Apple Wallet impose son propre gabarit : les
          couleurs, le logo et les textes sont repris, mais pas la mise en page de la carte web
          (motifs, animations, tampons dessinés). Adhérent et progression sont fictifs.
        </span>
      </p>

      <button type="button" className={styles.addButton} disabled aria-describedby="wallet-unavailable">
        Ajouter à Apple Wallet
      </button>
      <p id="wallet-unavailable" className={styles.unavailable}>
        Disponible une fois votre programme activé : le fichier Wallet est alors signé et généré
        pour chaque adhérent. Aucun fichier n&apos;est téléchargeable depuis cet aperçu.
      </p>
    </div>
  );
}
