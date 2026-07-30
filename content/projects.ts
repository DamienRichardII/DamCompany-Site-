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

export type Universe = "build" | "intelligence";

export type Project = {
  slug: string;
  name: string;
  /** Lien réel uniquement — laissé vide tant qu'il n'est pas confirmé (doc J). */
  url?: string;
  /** Secteur du client — non confirmé pour l'ensemble du portefeuille actuel. */
  sector: string;
  year?: number;
  universe: Universe;
  cover: StaticImageData;
  tech?: string[];
  summary?: string;
  /** Résultats chiffrés — vide tant qu'aucun résultat vérifié n'est fourni. */
  results: string[];
  published: boolean;
};

const SECTOR_PLACEHOLDER = "[À_VÉRIFIER]";

/**
 * Source unique des projets (doc 08). Seuls les 12 projets dont l'asset
 * existe réellement dans legacy-static/frontend/assets/ sont inclus
 * (doc 13-E). Le secteur n'étant confirmé pour aucun d'entre eux, il est
 * laissé en placeholder explicite plutôt qu'inventé (doc J) ; l'univers
 * est déduit du libellé factuel déjà donné par la doc 09 (suffixe "site"
 * = livrable BUILD, "IA" = livrable INTELLIGENCE), pas d'une supposition
 * sur l'activité du client.
 */
export const PROJECTS: Project[] = [
  {
    slug: "ubo-drop",
    name: "UBO-DROP",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: ubodropSite,
    results: [],
    published: true,
  },
  {
    slug: "ubodrop-app",
    name: "UBODROP App",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: ubodropApp,
    results: [],
    published: true,
  },
  {
    slug: "ma1",
    name: "MA1",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: ma1Site,
    results: [],
    published: true,
  },
  {
    slug: "ma1-ia",
    name: "MA1 IA",
    sector: SECTOR_PLACEHOLDER,
    universe: "intelligence",
    cover: ma1Ia,
    results: [],
    published: true,
  },
  {
    slug: "reset-smp",
    name: "Reset SMP",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: resetSmp,
    results: [],
    published: true,
  },
  {
    slug: "africa2kball",
    name: "Africa2kball",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: africa2kball,
    results: [],
    published: true,
  },
  {
    slug: "nad-motivation",
    name: "Nad Motivation",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: nadMotivation,
    results: [],
    published: true,
  },
  {
    slug: "i-can-play",
    name: "I Can Play",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: icp,
    results: [],
    published: true,
  },
  {
    slug: "one-one-arena",
    name: "One One Arena",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: oneOneArena,
    results: [],
    published: true,
  },
  {
    slug: "kingbrel",
    name: "KingBrel",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: kingbrel,
    results: [],
    published: true,
  },
  {
    slug: "divan-grill",
    name: "Divan Grill",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: divanGrill,
    results: [],
    published: true,
  },
  {
    slug: "peace-of-mind-signature",
    name: "Peace of Mind Signature",
    sector: SECTOR_PLACEHOLDER,
    universe: "build",
    cover: peaceOfMind,
    results: [],
    published: true,
  },
  // Sans asset disponible (doc 09/13-E) — non affichés tant que l'image et
  // l'accord client manquent :
  // Top Hoops, Amely Paris, Tibaduiza Elí, NeuroAlchemy 75, STY Fashion, NZ-100.
];

export const PUBLISHED_PROJECTS = PROJECTS.filter((project) => project.published);
