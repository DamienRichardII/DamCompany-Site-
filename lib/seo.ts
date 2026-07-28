import type { Metadata } from "next";

const SITE_NAME = "DamCompany";

// URL de production inconnue à ce stade (doc 00/J) — placeholder explicite.
export const SITE_URL = "https://[URL_PROD]";

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
};

export function buildMetadata({ title, description, path = "/" }: PageSeoInput): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type: "website",
      images: ["/brand/logo.svg"],
    },
  };
}
