/**
 * Motif de QR code DÉCORATIF pour les aperçus. Il n'encode rien et n'est pas
 * scannable : les vrais QR codes (public du commerce, individuel d'un
 * adhérent) n'existent qu'après activation.
 */
const SIZE = 25;

function buildMatrix(seed: number): boolean[][] {
  let state = seed >>> 0 || 1;
  const rand = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  const m: boolean[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => rand() > 0.52));

  const finder = (ox: number, oy: number) => {
    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) {
        const px = ox + x;
        const py = oy + y;
        if (px < 0 || py < 0 || px >= SIZE || py >= SIZE) continue;
        const ring = x >= 0 && x <= 6 && y >= 0 && y <= 6 && (x === 0 || x === 6 || y === 0 || y === 6);
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[py][px] = ring || core;
      }
    }
  };
  finder(0, 0);
  finder(SIZE - 7, 0);
  finder(0, SIZE - 7);
  return m;
}

const MATRIX = buildMatrix(20260);

export function FakeQr({ color = "#111111", className }: { color?: string; className?: string }) {
  const rects: string[] = [];
  MATRIX.forEach((row, y) =>
    row.forEach((on, x) => {
      if (on) rects.push(`M${x} ${y}h1v1h-1z`);
    })
  );
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path d={rects.join("")} fill={color} />
    </svg>
  );
}
