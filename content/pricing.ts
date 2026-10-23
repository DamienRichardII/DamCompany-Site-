/** Grille tarifaire (page /tarifs). `price: null` = sur devis. */
export type PriceItem = {
  name: string;
  /** Montant en euros ; null = sur devis. */
  price: number | null;
  /** Précision affichée sous le nom (ex. « Lot de 5 »). */
  note?: string;
  /** Unité affichée après le prix (ex. « / mois »). */
  unit?: string;
};

export type PriceGroup = {
  id: string;
  title: string;
  sub?: string;
  items: PriceItem[];
};

export const PRICE_GROUPS: PriceGroup[] = [
  {
    id: "sites",
    title: "Sites internet",
    sub: "Un site pensé pour votre activité, du simple vitrine à la boutique complète.",
    items: [
      { name: "Site vitrine", price: 250 },
      { name: "Site de réservation / location", price: 400 },
      { name: "Boutique en ligne", price: 600 },
      { name: "Site spécifique sur mesure", price: 700 },
      { name: "Portfolio", price: 200 },
    ],
  },
  {
    id: "abonnements",
    title: "Abonnements mensuels — site internet",
    sub: "Un suivi mensuel de votre site, au niveau qui vous convient.",
    items: [
      { name: "Offre Standard", price: 15, unit: "/ mois" },
      { name: "Offre Medium", price: 30, unit: "/ mois" },
      { name: "Offre Pro", price: 50, unit: "/ mois" },
    ],
  },
  {
    id: "supports",
    title: "Cartes & supports",
    sub: "Vos supports physiques et digitaux, dans l'identité de votre marque.",
    items: [
      { name: "Carte de fidélité", note: "Lot de 5", price: 40 },
      { name: "Carte de visite", note: "Lot de 5", price: 30 },
      { name: "Flyer", price: 30 },
      { name: "Carte de fidélité digitale", price: 50 },
      { name: "Carte de visite digitale", price: 40 },
    ],
  },
  {
    id: "apps-ia",
    title: "Applications, IA & outils",
    sub: "Des projets sur mesure : nous étudions votre besoin et vous envoyons un devis.",
    items: [
      { name: "Application mobile", price: null },
      { name: "CRM 3D", price: null },
      { name: "Dashboard Business automatisé", price: 150 },
      { name: "IA — Chatbot", price: null },
      { name: "Workflow IA", price: null },
      { name: "Agent IA", price: null },
    ],
  },
];
