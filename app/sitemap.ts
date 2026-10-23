import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PUBLISHED_PROJECTS } from "@/content/projects";
import { OFFERS } from "@/content/offers";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  ...OFFERS.map((o) => ({ path: `/services/${o.slug}`, priority: 0.8 })),
  { path: "/tarifs", priority: 0.9 },
  { path: "/realisations", priority: 0.8 },
  { path: "/carte-de-fidelite", priority: 0.7 },
  { path: "/a-propos", priority: 0.6 },
  { path: "/equipe", priority: 0.5 },
  { path: "/contact", priority: 0.7 },
  { path: "/mentions-legales", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    priority,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = PUBLISHED_PROJECTS.map((project) => ({
    url: `${SITE_URL}/realisations/${project.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticEntries, ...caseStudyEntries];
}
