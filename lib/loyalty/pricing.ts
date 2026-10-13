/**
 * Tarification de l'activation — CONFIGURATION CENTRALISÉE.
 *
 * Aucun tarif n'est défini dans le projet DamCompany à ce jour : on n'en
 * invente pas. Tant que `LOYALTY_PRICING` vaut `null`, le site n'affiche
 * aucun prix et propose uniquement « Demander l'activation ».
 *
 * Pour publier un tarif, renseignez l'objet ci-dessous (texte affiché) ET
 * créez le prix correspondant dans Stripe (variable STRIPE_LOYALTY_PRICE_ID).
 * Le montant réellement facturé est toujours celui du prix Stripe.
 */
export type LoyaltyPricing = {
  /** Texte affiché, ex. « Activation de votre programme ». */
  label: string;
  /** Montant affiché, ex. « 49 € ». À aligner sur le prix Stripe. */
  amountLabel: string;
  /** Précision, ex. « par mois, sans engagement ». */
  detail?: string;
};

export const LOYALTY_PRICING: LoyaltyPricing | null = null;
