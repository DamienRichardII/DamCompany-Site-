import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Bolt } from "@/components/brand/Brand";
import { SITE } from "@/lib/site";

export function CtaBand({
  title = "Un projet en tête ? Parlons-en.",
  text = "Décrivez-nous votre besoin : nous revenons vers vous rapidement avec une proposition claire et un devis.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="v-cta">
      <div className="v-container">
        <div className="v-cta-card">
          <Bolt className="v-cta-bolt" />
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="v-cta-actions">
            <Link href="/contact" className="v-btn v-btn-yellow">
              Demander un devis <ArrowRight size={16} aria-hidden />
            </Link>
            <a href={`tel:${SITE.phoneHref}`} className="v-btn v-btn-ghost-light">
              <Phone size={16} aria-hidden /> {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
