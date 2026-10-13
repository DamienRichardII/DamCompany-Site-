import { LIMITS, type LogoConfig } from "./config";
import { hexToHsl, hslToHex } from "./color";

/**
 * Import de logo : contrôle du format (signature binaire, pas seulement le
 * type MIME), de la taille, puis redimensionnement côté navigateur.
 * Aucun envoi serveur : le logo reste dans le navigateur (aperçu/brouillon).
 */

export type LogoFormat = "png" | "jpeg" | "webp";

export const LOGO_MIME_BY_FORMAT: Record<LogoFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export const LOGO_MAX_SIDE = 320;
export const LOGO_MIN_SIDE = 64;

/** Détecte le format réel d'après les premiers octets du fichier. */
export function detectImageFormat(bytes: Uint8Array): LogoFormat | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export type LogoValidation = { ok: true; format: LogoFormat } | { ok: false; error: string };

export function validateLogoBytes(bytes: Uint8Array, sizeBytes: number = bytes.length): LogoValidation {
  if (sizeBytes === 0) return { ok: false, error: "Le fichier est vide." };
  if (sizeBytes > LIMITS.logoMaxFileBytes) {
    return {
      ok: false,
      error: `Fichier trop volumineux (${(sizeBytes / 1024 / 1024).toFixed(1).replace(".", ",")} Mo). Maximum : 2 Mo.`,
    };
  }
  const format = detectImageFormat(bytes);
  if (!format) {
    return { ok: false, error: "Format non pris en charge. Utilisez un logo PNG, JPEG ou WebP." };
  }
  return { ok: true, format };
}

export type ProcessedLogo = Pick<LogoConfig, "dataUrl" | "width" | "height" | "dominant"> & { bytes: number };

/** Redimensionne (côté max 320 px) et ré-encode le logo. Navigateur uniquement. */
export async function processLogoFile(file: File): Promise<{ ok: true; logo: ProcessedLogo } | { ok: false; error: string }> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const check = validateLogoBytes(head, file.size);
  if (!check.ok) return check;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { ok: false, error: "Impossible de lire cette image. Essayez un autre fichier." };
  }

  if (Math.min(bitmap.width, bitmap.height) < LOGO_MIN_SIDE) {
    bitmap.close();
    return {
      ok: false,
      error: `Image trop petite (${bitmap.width}×${bitmap.height} px). Minimum : ${LOGO_MIN_SIDE} px de côté.`,
    };
  }

  const scale = Math.min(1, LOGO_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close();
    return { ok: false, error: "Votre navigateur ne permet pas le traitement d'image." };
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // WebP conserve la transparence ; repli PNG si le navigateur ne sait pas encoder en WebP.
  let dataUrl = canvas.toDataURL("image/webp", 0.92);
  if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/png");
  if (dataUrl.length > LIMITS.logoMaxStoredChars) {
    dataUrl = canvas.toDataURL("image/webp", 0.7);
    if (!dataUrl.startsWith("data:image/webp") || dataUrl.length > LIMITS.logoMaxStoredChars) {
      return { ok: false, error: "Logo trop complexe une fois optimisé. Essayez une version plus simple ou plus petite." };
    }
  }

  const dominant = dominantColor(ctx.getImageData(0, 0, width, height));
  return {
    ok: true,
    logo: { dataUrl, width, height, dominant, bytes: Math.round((dataUrl.length * 3) / 4) },
  };
}

/**
 * Couleur dominante « de marque » : moyenne des pixels opaques et assez
 * saturés (les blancs, noirs et gris sont ignorés). undefined si aucune.
 */
export function dominantColor(image: Pick<ImageData, "data" | "width" | "height">): string | undefined {
  const { data } = image;
  let r = 0, g = 0, b = 0, count = 0;
  const step = 4 * 3; // un pixel sur trois suffit
  for (let i = 0; i < data.length; i += step) {
    const alpha = data[i + 3];
    if (alpha < 200) continue;
    const pr = data[i], pg = data[i + 1], pb = data[i + 2];
    const max = Math.max(pr, pg, pb);
    const min = Math.min(pr, pg, pb);
    if (max < 40 || min > 225 || max - min < 40) continue; // noir, blanc, gris
    r += pr; g += pg; b += pb; count += 1;
  }
  if (count < 20) return undefined;
  const avg = hexFromRgb(r / count, g / count, b / count);
  const [h, s, l] = hexToHsl(avg);
  return hslToHex([h, Math.max(s, 45), Math.min(60, Math.max(35, l))]);
}

function hexFromRgb(r: number, g: number, b: number): string {
  const p = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${p(r)}${p(g)}${p(b)}`;
}
