import Link from "next/link";
import { Logo, SocialLinks } from "@/components/brand/Brand";
import { COMPANY_LINKS, LEGAL_LINKS, SERVICE_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="v-footer">
      <div className="v-container v-footer-grid">
        <div className="v-footer-brand">
          <Logo />
          <p>{SITE.tagline}</p>
          <SocialLinks size={24} />
        </div>

        <nav aria-label="Services">
          <h2 className="v-footer-title">Services</h2>
          <ul>
            {SERVICE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Entreprise">
          <h2 className="v-footer-title">Entreprise</h2>
          <ul>
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="v-footer-title">Contact</h2>
          <ul>
            <li>
              {SITE.city}, {SITE.postalCode}
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
            </li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="v-container v-footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
        </span>
        <span className="v-footer-legal">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </span>
      </div>
    </footer>
  );
}
