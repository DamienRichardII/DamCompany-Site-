import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Parlons de votre projet — formulaire de contact DamCompany, bientôt disponible.",
  path: "/contact",
});

// Le formulaire n'est pas encore reconstruit (route /api/contact à porter en
// Phase 3, doc 08) : on ne le présente pas comme fonctionnel avant qu'il le
// soit réellement (doc H/12).
export default function ContactPage() {
  return <ComingSoon eyebrow="Contact" title="Le formulaire de contact arrive bientôt" />;
}
