"use client";

import styles from "./PhoneMock.module.css";
import { LoyaltyCard } from "./LoyaltyCard";
import { FakeQr } from "./FakeQr";
import type { PreviewModel } from "@/lib/loyalty/config";

/**
 * Téléphone : ce que voit un adhérent sur la carte WEB du commerce.
 * Membre et progression fictifs (mention « Aperçu »).
 */
export function PhoneMock({ model }: { model: PreviewModel }) {
  return (
    <div className={styles.phone} role="group" aria-label="Aperçu de la carte web sur téléphone">
      <span className={styles.notch} aria-hidden="true" />
      <div className={styles.screen}>
        <div className={styles.status} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusDots} />
        </div>

        <div className={styles.page}>
          <p className={styles.kicker}>Ma carte de fidélité</p>
          <p className={styles.title}>{model.name}</p>

          <LoyaltyCard model={model} tilt={false} badge={false} />

          <div className={styles.member}>
            <span>
              <span className={styles.memberLabel}>Adhérent</span>
              <span className={styles.memberName}>Camille D.</span>
            </span>
            <span className={styles.preview}>Aperçu</span>
          </div>

          <div className={styles.qrBox}>
            <FakeQr className={styles.qr} />
            <span className={styles.qrText}>
              <strong>QR individuel</strong>
              <span>Présentez-le en caisse : le commerçant retrouve votre carte.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
