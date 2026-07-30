import type { StaticImageData } from "next/image";

import ubodropSite from "@/legacy-static/frontend/assets/Ubodrop-site.png";
import ubodropApp from "@/legacy-static/frontend/assets/Ubodrop-Applications.png";
import ma1Site from "@/legacy-static/frontend/assets/MA1-site.png";
import ma1Ia from "@/legacy-static/frontend/assets/MA1-IA.png";
import resetSmp from "@/legacy-static/frontend/assets/reset-smp-site.png";
import africa2kball from "@/legacy-static/frontend/assets/Africa2kball-site.png";
import nadMotivation from "@/legacy-static/frontend/assets/Nad-motivation-site.png";
import icp from "@/legacy-static/frontend/assets/ICP-site.png";
import oneOneArena from "@/legacy-static/frontend/assets/1x1-Arena-site.png";
import kingbrel from "@/legacy-static/frontend/assets/Kingbrel-site.png";
import divanGrill from "@/legacy-static/frontend/assets/Divan-Grill-site.png";
import peaceOfMind from "@/legacy-static/frontend/assets/Peaceofmind-site.png";
import flyFuture from "@/legacy-static/frontend/assets/Fly-future-champions-site.png";

export type Universe = "build" | "intelligence";

export type Project = {
  slug: string;
  name: string;
  /** Lien réel du projet livré. */
  url?: string;
  /** Secteur du client. */
  sector: string;
  year?: number;
  universe: Universe;
  cover: StaticImageData;
  tech?: string[];
  summary?: string;
  /** Résultats / livrables — fournis par le client, non fabriqués. */
  results: string[];
  published: boolean;
  // Champs étude de cas (Phase 4) — issus des données client (projets-completes-v2.csv).
  /** Captures desktop/mobile supplémentaires — assets réels uniquement. */
  gallery?: StaticImageData[];
  context?: string;
  solution?: string;
  features?: string[];
  artDirection?: string;
};

/**
 * Source unique des projets (doc 08). Contenu des études de cas fourni par
 * le client via projets-completes-v2.csv — rien n'est inventé. Un projet
 * n'est inclus que si son image de couverture existe réellement dans
 * legacy-static/frontend/assets/.
 */
export const PROJECTS: Project[] = [
  {
    slug: "ubo-drop",
    name: "UBO-DROP",
    sector: "Marketplace beauté / services à domicile",
    year: 2026,
    universe: "build",
    url: "https://ubodrop.com",
    cover: ubodropSite,
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    summary: "Landing page mobile-first présentant la promesse, le parcours en trois étapes, les métiers disponibles et les bénéfices de la plateforme, avec des CTA vers l’application et l’inscription professionnelle.",
    context: "Créer une vitrine de lancement capable d’expliquer rapidement une marketplace de professionnels de la beauté géolocalisés et de diriger clients et prestataires vers l’application.",
    solution: "Landing page mobile-first présentant la promesse, le parcours en trois étapes, les métiers disponibles et les bénéfices de la plateforme, avec des CTA vers l’application et l’inscription professionnelle.",
    features: ["Géolocalisation mise en avant", "aperçu des fiches professionnelles", "parcours client/pro", "sections pédagogiques", "CTA d’ouverture de l’application", "responsive design."],
    artDirection: "Univers beauté-tech premium, violet profond, cartes d’interface, visuels mobiles et mise en page orientée conversion.",
    results: ["Vitrine publique mise en ligne", "proposition de valeur clarifiée", "accès direct à l’application et au parcours professionnel."],
    published: true,
  },
  {
    slug: "ubodrop-app",
    name: "UBODROP App",
    sector: "Marketplace beauté / services à domicile",
    year: 2026,
    universe: "build",
    url: "https://ubodrop.com/app.html",
    cover: ubodropApp,
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "API REST", "MongoDB", "Railway", "Vercel"],
    summary: "Web app biface client/pro avec recherche de prestataires, fiches détaillées, réservation et espace professionnel.",
    context: "Centraliser la recherche, la réservation, la messagerie, les déplacements et la gestion des professionnels dans une seule web application.",
    solution: "Web app biface client/pro avec recherche de prestataires, fiches détaillées, réservation et espace professionnel.",
    features: ["Comptes client et pro", "carte et localisation", "multi-spécialités", "prestations", "portfolio", "réservations", "favoris", "messages", "profil", "gestion du mot de passe", "dashboard pro."],
    artDirection: "Interface mobile-first de marketplace, violet et blanc, navigation par onglets, cartes premium et parcours courts.",
    results: ["MVP fonctionnel déployé", "professionnels visibles côté client", "inscription, connexion et gestion des prestations opérationnelles", "base prête pour une bêta ouverte."],
    published: true,
  },
  {
    slug: "ma1",
    name: "MA1",
    sector: "EdTech / mobilité / intelligence artificielle",
    year: 2026,
    universe: "build",
    url: "https://ma1.fr/landingpage.html",
    cover: ma1Site,
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    summary: "Landing page commerciale structurée autour des bénéfices, des fonctionnalités, des tarifs, de la FAQ et des CTA d’inscription.",
    context: "Présenter une solution IA de révision du Code de la route et convertir les visiteurs en utilisateurs gratuits, premium ou clients auto-école.",
    solution: "Landing page commerciale structurée autour des bénéfices, des fonctionnalités, des tarifs, de la FAQ et des CTA d’inscription.",
    features: ["Présentation du chat IA", "QCM adaptatifs", "analyse de panneaux", "examens blancs", "plan de révision 30 jours", "tarifs", "FAQ", "CTA d’inscription."],
    artDirection: "Univers automobile et pédagogique, bleu nuit, accents lumineux, cartes fonctionnelles et iconographie routière.",
    results: ["Offres gratuite, premium et auto-école rendues lisibles", "parcours d’inscription simplifié", "landing connectée au produit."],
    published: true,
  },
  {
    slug: "ma1-ia",
    name: "MA1 IA",
    sector: "EdTech / intelligence artificielle",
    year: 2026,
    universe: "intelligence",
    url: "https://ma1.fr/index-standalone.html",
    cover: ma1Ia,
    tech: ["HTML", "CSS", "JavaScript", "Python", "FastAPI", "ChromaDB", "RAG", "Claude API", "Railway", "Vercel"],
    summary: "Application IA avec RAG sur les sources officielles, QCM adaptatifs, analyse d’images et espaces apprenant et moniteur.",
    context: "Créer un assistant de préparation au Code de la route combinant apprentissage adaptatif, réglementation officielle et suivi de progression.",
    solution: "Application IA avec RAG sur les sources officielles, QCM adaptatifs, analyse d’images et espaces apprenant et moniteur.",
    features: ["Chat IA", "RAG Légifrance", "QCM", "examen blanc", "analyse de panneaux", "veille réglementaire", "XP et classement", "plan 30 jours", "export PDF", "comptes utilisateurs."],
    artDirection: "Dashboard sombre et dynamique inspiré de la mobilité, navigation fonctionnelle, badges XP et codes couleur pédagogiques.",
    results: ["Application déployée", "parcours d’apprentissage complet", "suivi de progression, gamification et outils moniteur intégrés."],
    published: true,
  },
  {
    slug: "reset-smp",
    name: "Reset SMP",
    sector: "Beauté / micropigmentation capillaire",
    year: 2026,
    universe: "build",
    url: "https://reset-smp.com/",
    cover: resetSmp,
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    summary: "Site vitrine premium avec présentation des offres, tarifs, portfolio avant/après, blog, FAQ et accès au diagnostic.",
    context: "Moderniser la présence digitale d’un praticien SMP à Paris et Barcelone et rassurer une clientèle attentive au naturel des résultats.",
    solution: "Site vitrine premium avec présentation des offres, tarifs, portfolio avant/après, blog, FAQ et accès au diagnostic.",
    features: ["Présentation des services", "tarifs par zones", "galerie avant/après", "blog", "FAQ", "diagnostic", "WhatsApp et Instagram", "SEO local Paris et Barcelone."],
    artDirection: "Noir, blanc et tons peau ; esthétique clinique et luxueuse ; grandes photos avant/après ; typographie sobre et compositions éditoriales.",
    results: ["Offres et tarifs structurés", "portfolio valorisé", "prise de contact et diagnostic simplifiés", "présence Paris et Barcelone renforcée."],
    published: true,
  },
  {
    slug: "africa2kball",
    name: "Africa2kball",
    sector: "Sport / événementiel / basketball",
    year: 2026,
    universe: "build",
    url: "https://africa2kball.com/",
    cover: africa2kball,
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    summary: "Site événementiel multi-pages présentant le concept, les éditions, les nations et les parcours spectateurs et participants.",
    context: "Créer un hub officiel pour un tournoi de basketball inspiré de la CAN, valorisant les nations, l’histoire, les champions, la billetterie et les inscriptions.",
    solution: "Site événementiel multi-pages présentant le concept, les éditions, les nations et les parcours spectateurs et participants.",
    features: ["Accueil", "nations", "histoire", "champions", "billetterie", "inscriptions", "contact", "contenus événementiels", "responsive design."],
    artDirection: "Identité afro-sportive énergique, couleurs des nations, grands visuels basketball et ambiance mêlant compétition et culture.",
    results: ["Informations du tournoi centralisées", "billetterie et inscriptions accessibles", "histoire et champions mis en valeur."],
    published: true,
  },
  {
    slug: "nad-motivation",
    name: "Nad Motivation",
    sector: "Coaching / orientation scolaire et professionnelle",
    year: 2026,
    universe: "build",
    url: "https://nadmotivation.com/",
    cover: nadMotivation,
    tech: ["HTML", "CSS", "JavaScript", "intégration formulaire", "Vercel"],
    summary: "Site vitrine et de réservation présentant l’expertise, les prestations, les tarifs, les avis et un formulaire détaillé.",
    context: "Transformer une activité de coaching en une offre claire, rassurante et réservable en ligne.",
    solution: "Site vitrine et de réservation présentant l’expertise, les prestations, les tarifs, les avis et un formulaire détaillé.",
    features: ["Services et tarifs", "témoignages", "formulaire de réservation", "choix présentiel ou visioconférence", "date et créneau", "réseaux sociaux", "moyens de paiement présentés."],
    artDirection: "Univers chaleureux et bienveillant, bleu doux, cartes arrondies, iconographie accessible et ton motivationnel.",
    results: ["Offres et tarifs clarifiés", "demandes de coaching centralisées", "présence professionnelle et confiance renforcées."],
    published: true,
  },
  {
    slug: "i-can-play",
    name: "I Can Play",
    sector: "Média / sport / culture",
    year: 2026,
    universe: "build",
    url: "https://www.icanplayfr.com/",
    cover: icp,
    tech: ["Front-end sur mesure", "JavaScript", "responsive design", "Vercel"],
    summary: "Site éditorial minimaliste mettant en avant le positionnement, les projets et les références de marque.",
    context: "Créer une vitrine institutionnelle pour une plateforme créative née du basketball et active dans le sport, la culture et la communauté.",
    solution: "Site éditorial minimaliste mettant en avant le positionnement, les projets et les références de marque.",
    features: ["Hero de marque", "présentation", "portfolio de projets", "logos partenaires", "contact", "espace de connexion", "responsive design."],
    artDirection: "Direction artistique sport-culture contemporaine, noir et blanc, typographie massive, visuels plein écran et rythme éditorial.",
    results: ["Positionnement de la plateforme clarifié", "références majeures valorisées", "point de contact professionnel centralisé."],
    published: true,
  },
  {
    slug: "one-one-arena",
    name: "One One Arena",
    sector: "Sport / basketball / compétition",
    year: 2026,
    universe: "build",
    url: "https://onexonearena.fr/",
    cover: oneOneArena,
    tech: ["Front-end sur mesure", "JavaScript", "responsive design", "Vercel"],
    summary: "Site immersif dédié à l’Arena Tournament, l’Arena Battle et au classement des joueurs.",
    context: "Donner une identité digitale à une ligue de basketball en 1 contre 1 inspirée des sports de combat et structurer ses formats de compétition.",
    solution: "Site immersif dédié à l’Arena Tournament, l’Arena Battle et au classement des joueurs.",
    features: ["Présentation du concept", "pages Tournament et Battle", "ranking", "réseaux sociaux", "contact", "responsive design."],
    artDirection: "Univers sombre mêlant combat et basketball, identité agressive, visuels d’arène et typographies puissantes.",
    results: ["Concept du 1 contre 1 rendu immédiatement compréhensible", "formats et classement centralisés", "identité de ligue renforcée."],
    published: true,
  },
  {
    slug: "kingbrel",
    name: "KingBrel",
    sector: "Coiffure / barber / réservation",
    year: 2026,
    universe: "build",
    url: "https://kingbrel.com/",
    cover: kingbrel,
    tech: ["HTML", "CSS", "JavaScript", "EmailJS", "intégration calendrier", "Vercel"],
    summary: "Site vitrine avec catalogue de prestations, tarifs, disponibilités, réservation et contact.",
    context: "Créer une présence premium pour un barber et remplacer la prise de rendez-vous informelle par un parcours structuré.",
    solution: "Site vitrine avec catalogue de prestations, tarifs, disponibilités, réservation et contact.",
    features: ["Services par catégorie", "prix et durées", "calendrier de réservation", "horaires", "contact", "carte", "Instagram et TikTok", "mentions RGPD."],
    artDirection: "Noir et blanc premium, esthétique barber moderne, portrait central, typographie forte et interface épurée.",
    results: ["Prestations et tarifs accessibles en ligne", "réservation centralisée", "coordonnées et horaires regroupés."],
    published: true,
  },
  {
    slug: "divan-grill",
    name: "Divan Grill",
    sector: "Restauration / commande en ligne",
    year: 2026,
    universe: "build",
    url: "https://www.divangrill.fr/",
    cover: divanGrill,
    tech: ["HTML", "CSS", "JavaScript", "panier e-commerce", "intégration commande", "Vercel"],
    summary: "Site vitrine et de commande avec menu détaillé, panier et choix entre retrait sur place et livraison.",
    context: "Digitaliser le menu et la commande d’un restaurant turc halal à Clermont tout en valorisant son identité et ses spécialités.",
    solution: "Site vitrine et de commande avec menu détaillé, panier et choix entre retrait sur place et livraison.",
    features: ["Menu catégorisé", "fiches produits", "panier", "retrait ou livraison", "adresse", "heure souhaitée", "avis", "contact", "responsive design."],
    artDirection: "Univers chaleureux inspiré du feu de bois et de la cuisine turque, tons sombres et orangés, photos gourmandes et mise en page conviviale.",
    results: ["Menu et commande centralisés", "parcours retrait et livraison disponible", "visibilité locale et expérience client améliorées."],
    published: true,
  },
  {
    slug: "peace-of-mind-signature",
    name: "Peace of Mind Signature",
    sector: "Beauté / bien-être / e-commerce",
    year: 2026,
    universe: "build",
    url: "https://peaceofmindsignature.com/",
    cover: peaceOfMind,
    tech: ["HTML", "CSS", "JavaScript", "Booksy", "Resend", "API SMS OVH", "Vercel"],
    summary: "Écosystème vitrine avec présentation des expertises, collection, contact et accès direct à la réservation.",
    context: "Unifier les soins, la beauté, les infusions et la collection d’un institut premium de Gradignan dans une expérience cohérente.",
    solution: "Écosystème vitrine avec présentation des expertises, collection, contact et accès direct à la réservation.",
    features: ["Services soins et beauté", "réservation", "collection et infusions", "contact", "règles d’annulation", "moyens de paiement", "responsive design."],
    artDirection: "Luxe apaisant, palette neutre et naturelle, photographie éditoriale, espaces généreux et tonalité sensorielle.",
    results: ["Univers de marque unifié", "informations pratiques et réservation centralisées", "collection et expertise mieux valorisées."],
    published: true,
  },
  {
    slug: "fly-future-champions",
    name: "Fly Future Champions",
    sector: "Sport / basketball / détection et accompagnement",
    year: 2026,
    universe: "build",
    url: "https://flyfuturechampions.com/",
    cover: flyFuture,
    tech: ["HTML", "CSS", "JavaScript", "formulaire de pré-inscription", "panier", "paiement carte", "Apple Pay et PayPal", "responsive design"],
    summary: "Site multi-pages présentant les détections, les programmes d’accompagnement, les niveaux Future et Champions, les tarifs et les parcours d’inscription et de paiement.",
    context: "Structurer un programme destiné aux jeunes basketteurs souhaitant progresser du niveau régional vers le national ou intégrer un centre de formation.",
    solution: "Site multi-pages présentant les détections, les programmes d’accompagnement, les niveaux Future et Champions, les tarifs et les parcours d’inscription et de paiement.",
    features: ["Calendrier des détections", "pré-inscription", "collecte du profil joueur", "niveau, poste, taille et club", "galerie photos et vidéos", "analyse de match", "coaching personnalisé", "préparation mentale, physique et technique", "recherche d’essais et de clubs", "programmes mensuels et annuels", "panier", "paiement en ligne", "contact et réseaux sociaux."],
    artDirection: "Identité sportive bleu et blanc, titres puissants, visuels d’entraînement et de détection, compositions dynamiques et tonalité ambitieuse orientée haut niveau.",
    results: ["Détections et programmes centralisés", "candidatures joueurs mieux qualifiées", "accompagnements et tarifs clarifiés", "parcours d’inscription et de paiement réunis dans une expérience cohérente."],
    published: true,
  },
  // En attente de capture d'écran (image de couverture) avant publication —
  // données d'étude de cas déjà prêtes dans docs/.../projets-completes-v2.csv :
  //   - NZ 100%
  //   - Amely Paris
  //   - Top Hoops
  //   - Tibaduiza Elí
];

export const PUBLISHED_PROJECTS = PROJECTS.filter((project) => project.published);

export function getProjectBySlug(slug: string): Project | undefined {
  return PUBLISHED_PROJECTS.find((project) => project.slug === slug);
}

export function getProjectsByUniverse(universe?: Universe): Project[] {
  if (!universe) return PUBLISHED_PROJECTS;
  return PUBLISHED_PROJECTS.filter((project) => project.universe === universe);
}

export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const index = PUBLISHED_PROJECTS.findIndex((project) => project.slug === slug);
  if (index === -1) return {};

  const prev = PUBLISHED_PROJECTS[(index - 1 + PUBLISHED_PROJECTS.length) % PUBLISHED_PROJECTS.length];
  const next = PUBLISHED_PROJECTS[(index + 1) % PUBLISHED_PROJECTS.length];
  return { prev, next };
}
