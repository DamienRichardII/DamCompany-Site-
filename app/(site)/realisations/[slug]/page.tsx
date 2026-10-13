import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { CaseStudyHero } from "@/components/sections/CaseStudyHero";
import { CaseStudyContent } from "@/components/sections/CaseStudyContent";
import { CaseStudyNav } from "@/components/sections/CaseStudyNav";
import { PUBLISHED_PROJECTS, getProjectBySlug, getAdjacentProjects } from "@/content/projects";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PUBLISHED_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.name,
    description:
      project.context ??
      project.summary ??
      `Étude de cas ${project.name} — projet ${project.universe === "build" ? "BUILD" : "INTELLIGENCE"} réalisé par DamCompany.`,
    path: `/realisations/${project.slug}`,
    image: project.cover.src,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <main>
      <CaseStudyHero project={project} />
      <CaseStudyContent project={project} />
      <CaseStudyNav prev={prev} next={next} />
    </main>
  );
}
