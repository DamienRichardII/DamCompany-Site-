// Recompresse les PNG > 500 Ko de legacy-static/frontend/assets (doc 16-D.4).
// Quantification palette (proche pngquant) via sharp : gain de poids
// important, perte visuelle non perceptible sur des captures d'écran de
// site. Une copie de chaque original est conservée avant écrasement.
// Usage : npm run optimize-images
import { readdir, mkdir, copyFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "../legacy-static/frontend/assets");
const BACKUP_DIR = path.resolve(__dirname, "../legacy-static/frontend/assets-originaux");
const THRESHOLD_BYTES = 500 * 1024;

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} Ko`;
}

async function main() {
  const files = (await readdir(ASSETS_DIR)).filter((f) => f.toLowerCase().endsWith(".png"));
  await mkdir(BACKUP_DIR, { recursive: true });

  const rows = [];

  for (const file of files) {
    const filePath = path.join(ASSETS_DIR, file);
    const { size: before } = await stat(filePath);
    if (before < THRESHOLD_BYTES) continue;

    await copyFile(filePath, path.join(BACKUP_DIR, file));

    const buffer = await sharp(filePath)
      .png({ palette: true, quality: 82, compressionLevel: 9 })
      .toBuffer();

    if (buffer.length < before) {
      await writeFile(filePath, buffer);
      rows.push({ file, before, after: buffer.length });
    } else {
      rows.push({ file, before, after: before, skipped: true });
    }
  }

  console.log("\nOptimisation terminée :\n");
  for (const row of rows) {
    const savedPct = Math.round((1 - row.after / row.before) * 100);
    console.log(
      `${row.file.padEnd(30)} ${formatKb(row.before).padStart(9)} → ${formatKb(row.after).padStart(9)}` +
        (row.skipped ? "  (déjà optimal, ignoré)" : `  (-${savedPct}%)`)
    );
  }
  console.log(`\nOriginaux conservés dans : ${BACKUP_DIR}`);
}

main();
