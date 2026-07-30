import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PUBLISHED_PROJECTS } from "@/content/projects";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/realisations", priority: 0.9 },
  { path: "/services", priority: 0.6 },
  { path: "/a-propos", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
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
