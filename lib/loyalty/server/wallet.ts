import { PKPass } from "passkit-generator";
import { solidPng } from "./png";
import type { LoyaltyConfig } from "../config";

export type WalletCard = {
  serial: string;       // identifiant du pass (id de carte)
  publicToken: string;  // contenu du QR individuel
  balance: number;
  memberFirstName?: string | null;
  config: LoyaltyConfig;
};

const b64 = (value: string | undefined) => Buffer.from(value ?? "", "base64");

/** `#RRGGBB` → `rgb(r, g, b)` (format attendu par Wallet). */
export function toRgb(hex: string): string {
  const v = parseInt(hex.replace("#", ""), 16);
  return `rgb(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255})`;
}

/**
 * Génère un .pkpass SIGNÉ pour une carte réelle. Les certificats Apple ne
 * quittent jamais le serveur. Le QR contient `DCL1:<jeton>` : le scanner
 * identifie la carte, il ne la crédite jamais.
 */
export function buildPass(card: WalletCard, env: Record<string, string | undefined> = process.env): Buffer {
  const { config } = card;
  const accent = config.appearance.accent;
  const goal = config.program.mode === "stamps" ? config.program.stampsGoal : config.program.pointsGoal;

  const buffers: Record<string, Buffer> = {
    "icon.png": solidPng(29, accent),
    "icon@2x.png": solidPng(58, accent),
    "icon@3x.png": solidPng(87, accent),
  };
  const dataUrl = config.logo?.dataUrl ?? "";
  if (dataUrl.startsWith("data:image/png;base64,")) {
    const png = Buffer.from(dataUrl.split(",")[1], "base64");
    buffers["logo.png"] = png;
    buffers["logo@2x.png"] = png;
  }

  const pass = new PKPass(
    buffers,
    {
      wwdr: b64(env.APPLE_WWDR_CERT_B64),
      signerCert: b64(env.APPLE_SIGNER_CERT_B64),
      signerKey: b64(env.APPLE_SIGNER_KEY_B64),
      signerKeyPassphrase: env.APPLE_SIGNER_KEY_PASSPHRASE || undefined,
    },
    {
      formatVersion: 1,
      passTypeIdentifier: env.APPLE_PASS_TYPE_ID!,
      teamIdentifier: env.APPLE_TEAM_ID!,
      serialNumber: card.serial,
      organizationName: config.identity.businessName,
      description: `Carte de fidélité ${config.identity.businessName}`,
      logoText: config.identity.businessName,
      backgroundColor: toRgb(config.appearance.background),
      foregroundColor: toRgb(config.appearance.text),
      labelColor: toRgb(config.appearance.text),
    }
  );
  pass.type = "storeCard";

  pass.setBarcodes({ message: `DCL1:${card.publicToken}`, format: "PKBarcodeFormatQR", messageEncoding: "iso-8859-1" });
  pass.primaryFields.push({
    key: "balance",
    label: config.program.mode === "stamps" ? "TAMPONS" : "POINTS",
    value: `${card.balance} / ${goal}`,
  });
  pass.secondaryFields.push({ key: "reward", label: "RÉCOMPENSE", value: config.program.rewardLabel });
  if (card.memberFirstName) {
    pass.auxiliaryFields.push({ key: "member", label: "ADHÉRENT", value: card.memberFirstName });
  }
  if (config.program.conditions.trim()) {
    pass.backFields.push({ key: "conditions", label: "Conditions", value: config.program.conditions });
  }

  return pass.getAsBuffer();
}
