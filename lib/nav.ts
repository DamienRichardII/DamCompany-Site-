export type NavItem = { label: string; href: string };

/**
 * Arborescence cible (doc 05). Seule "/" est construite dans cette
 * exécution (Phase 2) ; les autres routes pointent vers des pages de
 * jalon ("bientôt disponible") pour éviter tout lien mort — aucune n'est
 * une redirection ou un contenu fictif.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Services", href: "/services" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];
