import { LegalBlock } from "@/components/site/Blocks";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mentions légales",
  description: "Mentions légales, hébergement, données personnelles, cookies et conditions générales de vente de DamCompany.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <main id="main" className="v-page">
      <div className="v-container">
        <LegalBlock heading="h1" />
      </div>
    </main>
  );
}
