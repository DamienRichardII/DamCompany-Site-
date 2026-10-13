import { OFFERS } from "@/content/offers";

export type NavItem = { label: string; href: string };

/** Navigation principale (maquette 01). */
export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos services", href: "/services" },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

/** Compat : l'ancien header exposait HEADER_NAV_ITEMS. */
export const HEADER_NAV_ITEMS = NAV_ITEMS;

export const SERVICE_LINKS: NavItem[] = OFFERS.map((o) => ({
  label: o.short,
  href: `/services/${o.slug}`,
}));

export const COMPANY_LINKS: NavItem[] = [
  { label: "À propos", href: "/a-propos" },
  { label: "Notre équipe", href: "/equipe" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Configurer ma carte fidélité", href: "/carte-de-fidelite" },
  { label: "Contact", href: "/contact" },
];

export const LEGAL_LINKS: NavItem[] = [{ label: "Mentions légales", href: "/mentions-legales" }];
