import type { Metadata } from "next";

const SITE_NAME = "DamCompany";
const TITLE_SEPARATOR = "—";
const DEFAULT_DESCRIPTION =
  "DamCompany — agence digitale : création de sites, applications, IA, data et automatisation. De l'idée au produit intelligent.";
const DEFAULT_OG_IMAGE = "/brand/og.jpg";

/**
 * URL de production : NEXT_PUBLIC_SITE_URL, sinon https://damcompany.tech en
 * production et localhost en développement — jamais une URL fictive codée en dur (doc 16-H).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "https://damcompany.tech" : "http://localhost:3000");

type PageSeoInput = {
  /** Titre de page brut (ex. "Réalisations") — le suffixe " — DamCompany" est appliqué via le title.template du layout racine. */
  title: string;
  description?: string;
  path?: string;
  /** Image OG réelle (ex. cover d'un projet) — défaut : public/brand/og.jpg. */
  image?: string;
};

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
}: PageSeoInput): Metadata {
  const isHome = title === SITE_NAME;
  const fullTitle = isHome ? title : `${title} ${TITLE_SEPARATOR} ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
