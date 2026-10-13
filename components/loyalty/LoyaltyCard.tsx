"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./LoyaltyCard.module.css";
import { progressLabel, type PreviewModel } from "@/lib/loyalty/config";
import { readableOn } from "@/lib/loyalty/color";

type LoyaltyCardProps = {
  model: PreviewModel;
  /** Inclinaison au survol (décorative, écran à pointeur précis uniquement). */
  tilt?: boolean;
  /** Affiche la pastille « Aperçu » (progression fictive). */
  badge?: boolean;
  className?: string;
};

/** Dimensionne les tampons (en cqw) pour qu'ils tiennent dans la carte quel que soit leur nombre. */
export function stampLayout(goal: number): { cols: number; rows: number; size: number } {
  const cols = goal <= 5 ? goal : goal <= 10 ? Math.ceil(goal / 2) : 8;
  const rows = Math.ceil(goal / cols);
  const byWidth = (88 - (cols - 1) * 2) / cols;
  const byHeight = (26 - (rows - 1) * 2) / rows;
  return { cols, rows, size: Math.round(Math.min(byWidth, byHeight, 15) * 10) / 10 };
}

export function LoyaltyCard({ model, tilt = true, badge = true, className }: LoyaltyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { colors, template, logo } = model;

  const vars = {
    "--lc-bg": colors.background,
    "--lc-fg": colors.text,
    "--lc-accent": colors.accent,
    "--lc-on-accent": readableOn(colors.accent),
  } as CSSProperties;

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!tilt || !el || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(0)}%`);
    el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(0)}%`);
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const { cols, size } = stampLayout(model.goal);
  const stamps = Array.from({ length: model.goal }, (_, i) => i < model.progress);
  const pointsRatio = Math.min(100, Math.round((model.progress / model.goal) * 100));
  const initial = model.hasName ? model.name.trim().charAt(0).toUpperCase() : "·";

  const summary =
    `Aperçu de la carte de fidélité de ${model.name} : ${progressLabel(model)}. Récompense : ${model.rewardLabel}.`;

  return (
    <div className={`${styles.scene} ${className ?? ""}`} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <motion.div
        key={template.id}
        ref={cardRef}
        className={styles.card}
        style={vars}
        data-font={template.fontStyle}
        data-shape={template.stampShape}
        initial={{ opacity: 0.6, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="img"
        aria-label={summary}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={template.pattern}
            className={styles.pattern}
            data-pattern={template.pattern}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <span className={styles.sheen} aria-hidden="true" />

        <div className={styles.content} aria-hidden="true">
          <div className={styles.head}>
            <span className={styles.logo} data-shape={logo?.shape ?? "circle"} data-empty={!logo}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL locale, déjà redimensionnée
                <img
                  src={logo.dataUrl}
                  alt=""
                  className={styles.logoImg}
                  style={{
                    transform: `translate(${logo.offsetX}%, ${logo.offsetY}%) scale(${logo.zoom})`,
                  }}
                />
              ) : (
                <span className={styles.initial}>{initial}</span>
              )}
            </span>
            <span className={styles.identity}>
              <span className={styles.name} data-placeholder={!model.hasName}>
                {model.name}
              </span>
              {model.sectorLabel ? <span className={styles.sector}>{model.sectorLabel}</span> : null}
            </span>
            {badge ? <span className={styles.badge}>Aperçu</span> : null}
          </div>

          <div className={styles.body}>
            {model.mode === "stamps" ? (
              <div
                className={styles.stamps}
                style={{ "--cols": cols, "--stamp": `${size}cqw` } as CSSProperties}
              >
                {stamps.map((filled, index) => (
                  <span key={index} className={styles.stamp} data-filled={filled} />
                ))}
              </div>
            ) : (
              <div className={styles.points}>
                <span className={styles.pointsValue}>
                  {model.progress.toLocaleString("fr-FR")}
                  <span className={styles.pointsUnit}> / {model.goal.toLocaleString("fr-FR")} pts</span>
                </span>
                <span className={styles.bar}>
                  <span className={styles.barFill} style={{ width: `${pointsRatio}%` }} />
                </span>
              </div>
            )}
          </div>

          <div className={styles.foot}>
            <span className={styles.reward} data-placeholder={!model.hasReward}>
              {model.rewardLabel}
            </span>
            <span className={styles.progressText}>{progressLabel(model)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
