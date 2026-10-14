import fs from "node:fs";
import path from "node:path";

/**
 * Emplacements d'images : si le fichier existe dans /public, il est utilisé
 * à la place du visuel codé. Permet de déposer des rendus IA / portraits
 * (ex. public/images/team/damien.webp) sans modifier le code.
 * À appeler uniquement côté serveur.
 */
export function mediaIfExists(relativePath: string): string | null {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", relativePath)) ? `/${relativePath}` : null;
  } catch {
    return null;
  }
}

export const MEDIA_SLOTS = {
  hero: "images/hero.webp",
  showroom: "images/a-propos-showroom.webp",
  team: ["images/team/damien.webp", "images/team/sandrine.webp"],
} as const;
