import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "À propos",
  description: "Vision, méthode et équipe DamCompany — bientôt disponible.",
  path: "/a-propos",
});

export default function AProposPage() {
  return <ComingSoon eyebrow="À propos" title="Notre vision et notre méthode arrivent bientôt" />;
}
