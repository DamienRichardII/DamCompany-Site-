/**
 * Source unique des informations d'entreprise (header, footer, contact,
 * mentions légales, JSON-LD). Modifier ici = modifier partout.
 */
export const SITE = {
  name: "DamCompany",
  domain: "damcompany.tech",
  tagline: "Des solutions digitales pour propulser votre business.",
  /** Email masqué tant que l'adresse professionnelle n'existe pas (renseigner NEXT_PUBLIC_CONTACT_EMAIL pour le réafficher). */
  email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null) as string | null,
  phone: "06 63 23 09 13",
  phoneHref: "+33663230913",
  whatsappHref: "https://wa.me/33663230913?text=Bonjour%20DamCompany%2C%20j%27aimerais%20avoir%20des%20informations.",
  city: "Aulnay-sous-Bois",
  postalCode: "93600",
  country: "France",
  hours: "Lun - Sam : 9h - 19h",
  founder: "Damien-Richard Miyouna",
  socials: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/@damcompany3",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/damcompany_",
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
