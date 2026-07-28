import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Réalisations",
  description: "Galerie d'études de cas DamCompany — bientôt disponible.",
  path: "/realisations",
});

export default function RealisationsPage() {
  return <ComingSoon eyebrow="Réalisations" title="La galerie de nos réalisations arrive bientôt" />;
}
