/**
 * Source unique des informations d'entreprise (header, footer, contact,
 * mentions légales, JSON-LD). Modifier ici = modifier partout.
 */
export const SITE = {
  name: "DamCompany",
  domain: "damcompany.tech",
  tagline: "Des solutions digitales pour propulser votre business.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@damcompany.tech",
  phone: "07 44 23 18 98",
  phoneHref: "+33744231898",
  city: "Aulnay-sous-Bois",
  postalCode: "93600",
  country: "France",
  hours: "Lun - Sam : 9h - 19h",
  founder: "Damien-Richard Miyouna",
  socials: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/@damcompany",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/damcompany",
  },
  stats: [
    { value: "+150", label: "Clients" },
    { value: "98%", label: "Satisfaction" },
    { value: "+3 ans", label: "d'expérience" },
  ],
} as const;

/** Mentions légales — champs administratifs fournis par variables d'environnement. */
export const LEGAL = {
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "DamCompany",
  legalForm: process.env.NEXT_PUBLIC_LEGAL_FORM ?? null,
  siret: process.env.NEXT_PUBLIC_LEGAL_SIRET ?? null,
  vat: process.env.NEXT_PUBLIC_LEGAL_VAT ?? null,
  publisher: SITE.founder,
  host: { name: "Vercel Inc.", url: "https://vercel.com" },
} as const;
