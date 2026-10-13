import { TeamBlock } from "@/components/site/Blocks";
import { CtaBand } from "@/components/site/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Notre équipe",
  description: "Une équipe passionnée et experte au service de vos projets web, mobile et IA — DamCompany.",
  path: "/equipe",
});

export default function EquipePage() {
  return (
    <main id="main" className="v-page">
      <div className="v-container">
        <TeamBlock heading="h1" />
      </div>
      <CtaBand />
    </main>
  );
}
