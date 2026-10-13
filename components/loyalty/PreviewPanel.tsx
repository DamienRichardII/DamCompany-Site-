"use client";

import { useId, useState } from "react";
import styles from "./PreviewPanel.module.css";
import { LoyaltyCard } from "./LoyaltyCard";
import { PhoneMock } from "./PhoneMock";
import { WalletPass } from "./WalletPass";
import type { PreviewModel } from "@/lib/loyalty/config";

type Tab = "web" | "wallet";

/** Aperçu en direct : carte web + téléphone, ou aperçu Apple Wallet (gabarit imposé). */
export function PreviewPanel({ model }: { model: PreviewModel }) {
  const [tab, setTab] = useState<Tab>("web");
  const baseId = useId();

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      setTab((current) => (current === "web" ? "wallet" : "web"));
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.tabs} role="tablist" aria-label="Type d'aperçu" onKeyDown={onKeyDown}>
        {(
          [
            ["web", "Carte web"],
            ["wallet", "Apple Wallet"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            id={`${baseId}-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`${baseId}-panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            className={styles.tab}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel-web`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-web`}
        hidden={tab !== "web"}
        className={styles.stage}
      >
        <div className={styles.composition}>
          <div className={styles.phoneWrap}>
            <PhoneMock model={model} />
          </div>
          <div className={styles.cardWrap}>
            <LoyaltyCard model={model} />
          </div>
        </div>
        <p className={styles.caption}>
          La carte web est entièrement libre : c&apos;est celle que vos clients ouvrent via votre
          lien d&apos;inscription.
        </p>
      </div>

      <div
        id={`${baseId}-panel-wallet`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-wallet`}
        hidden={tab !== "wallet"}
        className={styles.stage}
      >
        <WalletPass model={model} />
      </div>

      <p className={styles.legend}>Aperçu — adhérent et progression fictifs.</p>
    </div>
  );
}
