/**
 * Services réellement disponibles — calculé CÔTÉ SERVEUR à partir de
 * l'environnement. L'interface n'affiche une action que si le service
 * derrière existe : rien n'est simulé.
 *
 * Variables lues ici : voir .env.example (section « Carte de fidélité »).
 */

export type LoyaltyCapabilities = {
  /** Demande d'activation transmise par e-mail (Resend). */
  activationRequests: boolean;
  /** Paiement Stripe + base Supabase configurés (API prête ; portail commerçant requis côté UI). */
  checkoutApi: boolean;
  /** Certificats Apple Wallet présents : un pass signé PEUT être généré pour une carte réelle. */
  walletSigning: boolean;
};

type Env = Record<string, string | undefined>;

const has = (env: Env, ...keys: string[]) => keys.every((k) => Boolean(env[k]?.trim()));

export function getCapabilities(env: Env = process.env): LoyaltyCapabilities {
  return {
    activationRequests: has(env, "RESEND_API_KEY", "LOYALTY_ACTIVATION_TO", "LOYALTY_ACTIVATION_FROM"),
    checkoutApi: has(
      env,
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "STRIPE_LOYALTY_PRICE_ID",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY"
    ),
    walletSigning: has(
      env,
      "APPLE_PASS_TYPE_ID",
      "APPLE_TEAM_ID",
      "APPLE_WWDR_CERT_B64",
      "APPLE_SIGNER_CERT_B64",
      "APPLE_SIGNER_KEY_B64"
    ),
  };
}
