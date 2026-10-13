import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CheckDot, Icon } from "@/components/ui/Icon";
import { OfferVisual } from "@/components/visuals/Visuals";
import type { Offer } from "@/content/offers";

type Props = {
  offer: Offer;
  /** "lg" : hero de la page service ; "md" : carte de la grille. */
  size?: "lg" | "md";
  /** Niveau de titre (h1 sur la page service, h3 dans les grilles). */
  heading?: "h1" | "h2" | "h3";
};

export function OfferCard({ offer, size = "md", heading = "h3" }: Props) {
  const Heading = heading;
  const href = `/services/${offer.slug}`;
  return (
    <article className={`v-offer v-offer-${size}`} data-visual={offer.visual}>
      <header className="v-offer-head">
        <span className="v-num" aria-hidden>
          {offer.number}
        </span>
        <Heading className="v-offer-title">
          {size === "md" ? (
            <Link href={href} className="v-offer-titlelink">
              {offer.title}
            </Link>
          ) : (
            offer.title
          )}
        </Heading>
        {size === "md" && (
          <Link href={href} className="v-offer-go" aria-label={`Découvrir : ${offer.title}`}>
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        )}
      </header>

      <div className="v-offer-body">
        <div className="v-offer-text">
          {offer.kicker && <p className="v-offer-kicker">{offer.kicker}</p>}
          <ul className="v-checks">
            {offer.bullets.map((b) => (
              <li key={b}>
                <CheckDot />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link href={`/contact?service=${offer.slug}`} className="v-btn v-btn-dark">
            Demander un devis <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="v-offer-visual" aria-hidden>
          <OfferVisual kind={offer.visual} />
        </div>
      </div>

      {offer.features && (
        <ul className="v-features">
          {offer.features.map((f) => (
            <li key={f.label}>
              <Icon name={f.icon} size={22} />
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
