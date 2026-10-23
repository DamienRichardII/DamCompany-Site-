import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Bolt, SocialLinks } from "@/components/brand/Brand";
import { Showroom } from "@/components/visuals/Visuals";
import { ContactForm } from "./ContactForm";
import { TeamCarousel, type TeamMember } from "./TeamCarousel";
import { LEGAL, SITE } from "@/lib/site";
import { MEDIA_SLOTS, mediaIfExists } from "@/lib/media";

/* ----------------------------- 10 — À propos ----------------------------- */

export function AboutBlock({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Heading = heading;
  return (
    <section className="v-card v-about" aria-labelledby="about-title">
      <div className="v-about-text">
        <div className="v-card-head">
          <span className="v-num" aria-hidden>
            10
          </span>
          <Heading id="about-title">À propos</Heading>
        </div>
        <p>
          DamCompany est une agence digitale basée à Aulnay-sous-Bois, spécialisée dans la création de sites internet,
          d&apos;applications mobiles, d&apos;outils digitaux et de solutions innovantes pour les entreprises.
        </p>
        <p className="v-about-more">
          Notre approche : comprendre votre activité, concevoir une solution sur mesure et l&apos;accompagner après la
          mise en ligne. Un seul interlocuteur, du premier échange à la livraison.
        </p>
        <span className="v-pill">
          <Bolt className="v-pill-bolt" /> Notre mission
        </span>
        <p className="v-about-mission">{SITE.tagline}</p>
        <dl className="v-stats">
          {SITE.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Showroom image={mediaIfExists(MEDIA_SLOTS.showroom)} />
    </section>
  );
}

/* ----------------------------- 11 — Équipe ------------------------------- */

const MEMBERS: Omit<TeamMember, "image">[] = [
  { name: "Damien-Richard Miyouna", role: "Fondateur" },
  { name: "Sandrine Kellam Nonga", role: "Directrice adjointe" },
];

export function TeamBlock({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Heading = heading;
  const members: TeamMember[] = MEMBERS.map((m, i) => ({ ...m, image: mediaIfExists(MEDIA_SLOTS.team[i]) }));
  return (
    <section className="v-card v-teamcard" aria-labelledby="team-title">
      <div className="v-card-head">
        <span className="v-num" aria-hidden>
          11
        </span>
        <Heading id="team-title">Notre équipe</Heading>
      </div>
      <p className="v-card-sub">Une équipe passionnée et experte à votre service.</p>
      <TeamCarousel members={members} />
    </section>
  );
}

/* ----------------------------- 12 — Contact ------------------------------ */

export function ContactBlock({ heading = "h2", defaultProject = "" }: { heading?: "h1" | "h2"; defaultProject?: string }) {
  const Heading = heading;
  return (
    <section className="v-card v-contact" aria-labelledby="contact-title">
      <div className="v-contact-info">
        <div className="v-card-head">
          <span className="v-num" aria-hidden>
            12
          </span>
          <Heading id="contact-title">Contact</Heading>
        </div>
        <ul>
          <li>
            <MapPin size={18} aria-hidden />
            <span>
              {SITE.city}, {SITE.postalCode}
            </span>
          </li>
          {SITE.email && (
            <li>
              <Mail size={18} aria-hidden />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          )}
          <li>
            <Phone size={18} aria-hidden />
            <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
          </li>
          <li>
            <Clock size={18} aria-hidden />
            <span>{SITE.hours}</span>
          </li>
        </ul>
        <SocialLinks size={24} />
      </div>
      <ContactForm defaultProject={defaultProject} />
    </section>
  );
}

/* ------------------------- 13 — Mentions légales ------------------------- */

const MISSING = "En cours de renseignement";

export function LegalBlock({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Heading = heading;
  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "Informations légales",
      body: (
        <>
          <p>
            Le site <strong>{SITE.domain}</strong> est édité par <strong>{LEGAL.legalName}</strong>, agence digitale
            basée à {SITE.city} ({SITE.postalCode}), {SITE.country}.
          </p>
          <ul>
            <li>Forme juridique : {LEGAL.legalForm ?? MISSING}</li>
            <li>SIRET : {LEGAL.siret ?? MISSING}</li>
            <li>TVA intracommunautaire : {LEGAL.vat ?? MISSING}</li>
            <li>Directeur de la publication : {LEGAL.publisher}</li>
            <li>
              Contact : {SITE.email && <><a href={`mailto:${SITE.email}`}>{SITE.email}</a> · </>}{SITE.phone}
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Hébergement",
      body: (
        <p>
          Le site est hébergé par <strong>{LEGAL.host.name}</strong> —{" "}
          <a href={LEGAL.host.url} target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
          .
        </p>
      ),
    },
    {
      title: "Propriété intellectuelle",
      body: (
        <p>
          L&apos;ensemble des contenus du site (textes, visuels, logos, code, animations) est la propriété de{" "}
          {LEGAL.legalName}, sauf mention contraire. Toute reproduction, représentation ou adaptation, totale ou
          partielle, sans autorisation écrite préalable est interdite. Les marques et logos des clients cités
          appartiennent à leurs propriétaires respectifs.
        </p>
      ),
    },
    {
      title: "Données personnelles",
      body: (
        <>
          <p>
            Les informations saisies dans le formulaire de contact (nom, email, description du projet) sont utilisées
            uniquement pour répondre à votre demande et ne sont ni vendues ni cédées. Elles sont transmises par email
            via notre prestataire d&apos;envoi (Resend) et conservées le temps nécessaire au traitement de votre demande
            et de la relation commerciale qui peut en découler.
          </p>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
            d&apos;opposition et de portabilité. Pour l&apos;exercer, contactez-nous{" "}
            {SITE.email ? <>à <a href={`mailto:${SITE.email}`}>{SITE.email}</a></> : <>par téléphone ou WhatsApp au {SITE.phone}</>}. Vous pouvez également saisir la CNIL (cnil.fr).
          </p>
        </>
      ),
    },
    {
      title: "Cookies",
      body: (
        <p>
          Ce site n&apos;utilise aucun cookie publicitaire ni de suivi inter-sites. La mesure d&apos;audience, lorsqu&apos;elle
          est activée, est anonymisée et fonctionne sans cookie. Les éventuelles préférences d&apos;affichage restent
          stockées dans votre navigateur.
        </p>
      ),
    },
    {
      title: "Conditions générales de vente",
      body: (
        <>
          <p>
            Chaque prestation fait l&apos;objet d&apos;un devis détaillé (périmètre, délais, prix). Le devis signé vaut
            commande ; un acompte, dont le montant est précisé sur le devis, peut être demandé au lancement du projet.
          </p>
          <p>
            Les droits d&apos;utilisation des livrables sont cédés au client après règlement intégral de la prestation.
            Les délais indiqués sont donnés à titre prévisionnel et supposent la transmission des contenus par le
            client dans les temps convenus. Toute demande hors périmètre fait l&apos;objet d&apos;un avenant ou d&apos;un
            nouveau devis. Un suivi ou une maintenance peut être souscrit séparément.
          </p>
          <p>
            Pour toute question sur ces conditions, contactez-nous {SITE.email ? <>à <a href={`mailto:${SITE.email}`}>{SITE.email}</a></> : <>par téléphone ou WhatsApp au {SITE.phone}</>}.
          </p>
        </>
      ),
    },
  ];

  return (
    <section className="v-card v-legal" aria-labelledby="legal-title">
      <div className="v-legal-main">
        <div className="v-card-head">
          <span className="v-num" aria-hidden>
            13
          </span>
          <Heading id="legal-title">Mentions légales</Heading>
        </div>
        <div className="v-acc">
          {sections.map((s, i) => (
            <details key={s.title} name="legal" open={i === 0}>
              <summary>
                <span>
                  {i + 1}. {s.title}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="v-acc-body">{s.body}</div>
            </details>
          ))}
        </div>
      </div>
      <aside className="v-legal-side" aria-hidden>
        <Bolt className="v-legal-bolt" />
        <b>DamC</b>
        <p>{SITE.tagline}</p>
        <small>Aulnay — Paris — France</small>
      </aside>
    </section>
  );
}

export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="v-btn v-btn-light">
      {children} <ArrowRight size={16} aria-hidden />
    </Link>
  );
}
