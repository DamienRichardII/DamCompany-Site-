export type IconName =
  | "web"
  | "mobile"
  | "ai"
  | "crm"
  | "report"
  | "motion"
  | "loyalty"
  | "print"
  | "design"
  | "responsive"
  | "seo"
  | "payment"
  | "notification";

export type VisualKey = "web" | "mobile" | "ai" | "crm" | "report" | "motion" | "loyalty" | "print";

export type Offer = {
  slug: string;
  /** Numéro de la maquette (02 → 09). */
  number: string;
  title: string;
  /** Libellé court (icônes de l'accueil, liens). */
  short: string;
  icon: IconName;
  visual: VisualKey;
  /** Sous-titre éventuel au-dessus de la liste (page CRM). */
  kicker?: string;
  bullets: string[];
  features?: { icon: IconName; label: string }[];
  intro: string;
  why: { title: string; text: string }[];
  metaDescription: string;
};

export const OFFERS: Offer[] = [
  {
    slug: "site-internet",
    number: "02",
    title: "Création de site internet",
    short: "Sites internet",
    icon: "web",
    visual: "web",
    bullets: ["Site vitrine", "Site e-commerce", "Site de réservation", "Site sur mesure"],
    features: [
      { icon: "design", label: "Design moderne" },
      { icon: "responsive", label: "100% responsive" },
      { icon: "seo", label: "SEO optimisé" },
      { icon: "payment", label: "Paiement en ligne" },
      { icon: "notification", label: "Notifications automatiques" },
    ],
    intro:
      "Un site qui présente votre activité, rassure vos clients et transforme les visites en demandes, en réservations ou en ventes. Conçu sur mesure, rapide et pensé d'abord pour le mobile.",
    why: [
      { title: "Pensé pour convertir", text: "Parcours clair, appels à l'action visibles et formulaires simples : chaque page a un objectif." },
      { title: "Rapide et bien référencé", text: "Performances soignées, structure SEO propre et balisage prêt pour les moteurs de recherche." },
      { title: "Évolutif", text: "Un socle moderne qui grandit avec vous : paiement en ligne, réservation, espace client, newsletter." },
    ],
    metaDescription:
      "Création de site vitrine, e-commerce, de réservation ou sur mesure : design moderne, 100% responsive, SEO optimisé. DamCompany, agence digitale à Aulnay-sous-Bois.",
  },
  {
    slug: "application-mobile",
    number: "03",
    title: "Application mobile",
    short: "Applications mobiles",
    icon: "mobile",
    visual: "mobile",
    bullets: [
      "Application iOS & Android",
      "Design sur mesure",
      "Espace client",
      "Paiement intégré",
      "Notifications push",
    ],
    intro:
      "Une application iOS et Android qui garde vos clients à portée de main : compte client, réservation, paiement et notifications push, dans une expérience fluide et à votre image.",
    why: [
      { title: "Une base, deux stores", text: "Une seule application pensée pour iOS et Android, plus simple à maintenir et à faire évoluer." },
      { title: "Une expérience premium", text: "Interface soignée, animations légères et parcours courts pour que vos clients reviennent." },
      { title: "Connectée à votre activité", text: "Paiement, agenda, fidélité et notifications reliés à vos outils existants." },
    ],
    metaDescription:
      "Développement d'applications mobiles iOS & Android sur mesure : espace client, paiement intégré, notifications push. DamCompany.",
  },
  {
    slug: "creation-ia",
    number: "04",
    title: "Création d'IA",
    short: "Intelligence artificielle",
    icon: "ai",
    visual: "ai",
    bullets: [
      "Assistant personnalisé",
      "Automatisation des tâches",
      "Chatbot intelligent",
      "Intégration sur votre site",
      "Gain de temps et productivité",
    ],
    intro:
      "Des assistants et agents IA entraînés sur votre activité : ils répondent à vos clients, qualifient vos prospects et automatisent les tâches répétitives, 24h/24.",
    why: [
      { title: "À l'image de votre marque", text: "Ton, connaissances et règles définis avec vous : l'assistant parle comme votre équipe." },
      { title: "Du temps gagné", text: "Réponses instantanées, tri des demandes et relances automatiques, sans effort supplémentaire." },
      { title: "Branché à vos outils", text: "Site, WhatsApp, Instagram, agenda, CRM : l'IA agit là où vos clients vous écrivent." },
    ],
    metaDescription:
      "Création d'assistants IA, chatbots intelligents et automatisations intégrés à votre site et à vos outils. DamCompany.",
  },
  {
    slug: "crm-3d",
    number: "05",
    title: "CRM 3D personnalisée",
    short: "CRM 3D",
    icon: "crm",
    visual: "crm",
    kicker: "La nouvelle génération de CRM",
    bullets: [
      "Interface 3D interactive",
      "Gestion clients & prospects",
      "Connexion WhatsApp, Instagram…",
      "Suivi des ventes",
      "Tableaux de bord avancés",
    ],
    intro:
      "Un CRM construit autour de votre façon de vendre : clients, prospects, conversations et ventes réunis dans une interface interactive, claire et agréable à utiliser au quotidien.",
    why: [
      { title: "Sur mesure, pas générique", text: "Champs, étapes et automatisations calqués sur votre processus commercial." },
      { title: "Tous vos canaux réunis", text: "WhatsApp, Instagram, email et site connectés : plus aucune demande ne se perd." },
      { title: "Piloté par les chiffres", text: "Suivi des ventes et tableaux de bord pour décider vite et relancer au bon moment." },
    ],
    metaDescription:
      "CRM sur mesure avec interface 3D interactive : gestion clients et prospects, connexion WhatsApp/Instagram, suivi des ventes. DamCompany.",
  },
  {
    slug: "reporting-automatise",
    number: "06",
    title: "Reporting automatisé",
    short: "Reporting automatisé",
    icon: "report",
    visual: "report",
    bullets: [
      "Tableaux de bord sur mesure",
      "Connexion multi-sources",
      "Données en temps réel",
      "Rapports automatiques",
      "Suivi de performance",
    ],
    intro:
      "Vos chiffres, enfin lisibles : nous connectons vos sources de données et construisons des tableaux de bord et rapports qui se mettent à jour tout seuls.",
    why: [
      { title: "Une seule vue", text: "Ventes, trafic, réservations, finances : toutes vos sources dans un même tableau de bord." },
      { title: "Toujours à jour", text: "Données en temps réel et rapports envoyés automatiquement à la fréquence de votre choix." },
      { title: "Orienté décision", text: "Indicateurs choisis avec vous pour suivre ce qui compte vraiment pour votre activité." },
    ],
    metaDescription:
      "Reporting automatisé : tableaux de bord sur mesure, connexion multi-sources, données en temps réel et rapports automatiques. DamCompany.",
  },
  {
    slug: "motion-design",
    number: "07",
    title: "Vidéo promo en motion design",
    short: "Motion design",
    icon: "motion",
    visual: "motion",
    bullets: [
      "Vidéo publicitaire",
      "Animation logo",
      "Réseaux sociaux",
      "Présentation d'activité",
      "Format court ou long",
    ],
    intro:
      "Des vidéos animées qui présentent votre marque en quelques secondes : publicités, animations de logo et formats réseaux sociaux, créés sur mesure.",
    why: [
      { title: "Impact immédiat", text: "Un message clair et un rythme soigné pour capter l'attention dès les premières secondes." },
      { title: "Tous les formats", text: "Vertical, carré ou horizontal : livré prêt pour Instagram, TikTok, YouTube et votre site." },
      { title: "Cohérent avec votre identité", text: "Couleurs, typographies et ton de votre marque respectés dans chaque animation." },
    ],
    metaDescription:
      "Vidéos promo en motion design : publicité, animation de logo, formats réseaux sociaux, court ou long. DamCompany.",
  },
  {
    slug: "carte-fidelite-3d",
    number: "08",
    title: "Carte fidélité digitale 3D",
    short: "Carte fidélité 3D",
    icon: "loyalty",
    visual: "loyalty",
    bullets: [
      "Configurateur 3D",
      "Apple Wallet / Google Wallet",
      "QR Code",
      "Design personnalisé",
      "Suivi clients",
    ],
    intro:
      "Une carte de fidélité digitale à votre image, ajoutée en un scan dans le wallet de vos clients. Vous la configurez en 3D, nous la mettons en service et vous suivez vos clients.",
    why: [
      { title: "Dans le téléphone, pas au fond d'un sac", text: "Apple Wallet et Google Wallet : la carte est toujours à portée de main." },
      { title: "Configurable en 3D", text: "Couleurs, logo et programme visualisés en direct avant la mise en service." },
      { title: "Suivi clients inclus", text: "Passages, récompenses et clients fidèles visibles depuis votre espace." },
    ],
    metaDescription:
      "Carte de fidélité digitale 3D : configurateur, Apple Wallet / Google Wallet, QR code, design personnalisé, suivi clients. DamCompany.",
  },
  {
    slug: "supports-de-creation",
    number: "09",
    title: "Supports de création",
    short: "Supports de création",
    icon: "print",
    visual: "print",
    bullets: ["Flyers", "Cartes de visite", "Cartes de fidélité"],
    intro:
      "Les supports qui prolongent votre marque hors écran : flyers, cartes de visite et cartes de fidélité, dessinés dans la même identité que votre site.",
    why: [
      { title: "Une identité cohérente", text: "Mêmes couleurs, mêmes codes : vos supports et votre site se reconnaissent au premier coup d'œil." },
      { title: "Prêts à imprimer", text: "Fichiers livrés aux bons formats, avec fonds perdus et repères de coupe." },
      { title: "Du digital au physique", text: "QR codes et liens intégrés pour renvoyer vers votre site, votre réservation ou votre carte fidélité." },
    ],
    metaDescription:
      "Supports de création : flyers, cartes de visite, cartes de fidélité, dans l'identité de votre marque. DamCompany.",
  },
];

export const getOffer = (slug: string) => OFFERS.find((o) => o.slug === slug);

export const PROCESS_STEPS = [
  { title: "Cadrage", text: "Nous définissons vos objectifs, votre cible et le périmètre exact du projet." },
  { title: "Design", text: "Maquettes validées avec vous avant d'écrire la moindre ligne de code." },
  { title: "Développement", text: "Développement propre, testé, avec des versions intermédiaires à valider." },
  { title: "Lancement & suivi", text: "Mise en ligne, prise en main et suivi après livraison." },
] as const;
