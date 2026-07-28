import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "BUILD & INTELLIGENCE — les deux univers de services DamCompany, bientôt disponibles.",
  path: "/services",
});

export default function ServicesPage() {
  return <ComingSoon eyebrow="Services" title="Les univers BUILD & INTELLIGENCE arrivent bientôt" />;
}
