import { ContactBlock } from "@/components/site/Blocks";
import { PROJECT_TYPES } from "@/lib/contact/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Parlons de votre projet : écrivez à DamCompany, agence digitale à Aulnay-sous-Bois, pour obtenir un devis rapidement.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const defaultProject = (PROJECT_TYPES as readonly string[]).includes(service ?? "") ? (service as string) : "";
  return (
    <main id="main" className="v-page">
      <div className="v-container">
        <ContactBlock heading="h1" defaultProject={defaultProject} />
      </div>
    </main>
  );
}
