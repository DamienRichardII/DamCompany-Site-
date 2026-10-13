// Génère public/brand/og.webp (1200×630) à partir du logo et des tokens de
// marque (doc 06/16-D.1). Pas d'asset photo définitif fourni à ce stade :
// image sobre logo + fond de marque, comme autorisé par le doc 16-H.
// Usage : npm run generate-og-image
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../public/brand/og.webp");

const CREAM = "#faf7ef";
const BLACK = "#141414";
const YELLOW = "#ffc83d";

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}" />
  <g transform="translate(365, 235)">
    <path d="M150 6 L92 64 L128 64 L104 116 L188 44 L150 44 L172 6 Z"
          fill="${YELLOW}" stroke="${BLACK}" stroke-width="3" stroke-linejoin="round"/>
    <text x="150" y="92" font-family="Arial, sans-serif"
          font-size="96" font-weight="800" letter-spacing="-4" fill="${BLACK}">Dam</text>
    <path d="M439.2 36.7 A 33 33 0 1 0 439.2 87.3" fill="none"
          stroke="${BLACK}" stroke-width="22" stroke-linecap="round"/>
  </g>
  <text x="${WIDTH / 2}" y="430" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="30" font-weight="600" letter-spacing="2" fill="${BLACK}"
        opacity="0.7">AGENCE DIGITALE — BUILD &amp; INTELLIGENCE</text>
</svg>
`;

await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outputPath);

console.log(`OG image générée : ${outputPath}`);
