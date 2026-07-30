import type { Universe } from "./projects";

export type ServiceUniverse = {
  id: Universe;
  title: string;
  tagline: string;
  items: string[];
};

/**
 * Deux univers de services (doc 04/13-D) — libellés repris tels quels de la
 * définition du concept, pas de contenu inventé sur des offres non décrites.
 */
export const SERVICES: ServiceUniverse[] = [
  {
    id: "build",
    title: "BUILD",
    tagline: "Sites, applications et plateformes pensés pour convertir.",
    items: [
      "Sites web",
      "E-commerce",
      "Réservation",
      "Location",
      "Applications web",
      "Applications mobiles",
      "Plateformes métiers",
    ],
  },
  {
    id: "intelligence",
    title: "INTELLIGENCE",
    tagline: "IA, data et automatisation au service de la performance.",
    items: [
      "Agents IA",
      "Chatbots",
      "Automatisation",
      "CRM",
      "Data",
      "Reporting",
      "Tableaux de bord",
    ],
  },
];
