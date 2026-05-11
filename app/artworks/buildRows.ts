export type Row<T extends { featured: boolean }> = {
  columns: 2 | 3;
  items: T[];
};

/**
 * Splits pieces into alternating 3-up (non-featured) and 2-up (featured) rows.
 *
 * Rules:
 *  - Strict alternation: 3-up → 2-up → 3-up → …
 *  - 3-up rows draw from the non-featured pool; 2-up rows draw from the featured pool.
 *  - If one pool empties first, the remaining pool drains into uniform 3-up rows.
 *  - Fewer than 6 total pieces, or no featured pieces → uniform 3-up throughout.
 *  - No featured pieces in the non-featured pool (and vice versa).
 *
 * Edge cases (input → output):
 *
 *  1 piece total (< 6):
 *    [A]  →  [{ columns: 3, items: [A] }]
 *
 *  4 pieces total (< 6), mix of featured/non-featured — pattern skipped:
 *    [A, B, C, D]  →  [{ columns: 3, items: [A, B, C] }, { columns: 3, items: [D] }]
 *
 *  6 non-featured, 0 featured (featured pool empty) — uniform 3-up:
 *    [A, B, C, D, E, F]  →  [{ columns: 3, items: [A,B,C] }, { columns: 3, items: [D,E,F] }]
 *
 *  0 non-featured, 6 featured — 2-up all the way:
 *    [X, Y, Z, X2, Y2, Z2]  →  [{ columns: 2, items: [X,Y] }, { columns: 2, items: [Z,X2] }, { columns: 2, items: [Y2,Z2] }]
 *
 *  Main alternating pattern — 6 non-featured (A–F), 4 featured (X–Z1):
 *    Row 1 (3-up, non-feat): [A, B, C]
 *    Row 2 (2-up, featured):  [X, Y]
 *    Row 3 (3-up, non-feat): [D, E, F]
 *    Row 4 (2-up, featured):  [Z, Z1]
 *
 *  1 leftover non-featured (last 3-up row has 1 item → renders 33%-wide, left-aligned):
 *    non-featured=[A,B,C,D], featured=[X,Y]:
 *    [{ 3, [A,B,C] }, { 2, [X,Y] }, { 3, [D] }]
 *
 *  1 leftover featured (falls on a scheduled 2-up row → renders at 2-up width, left-aligned):
 *    non-featured=[A,B,C,D,E,F], featured=[X,Y,Z]:
 *    [{ 3, [A,B,C] }, { 2, [X,Y] }, { 3, [D,E,F] }, { 2, [Z] }]
 *
 *  Non-featured exhausted mid-pattern → remaining featured drains into 3-up rows:
 *    non-featured=[A,B,C], featured=[X,Y,Z,Z1]:
 *    Row 1 (3-up): [A,B,C], ni exhausted
 *    Row 2 (2-up): [X,Y]
 *    Drain featured → [{ 3, [Z,Z1] }]
 *    Result: [{ 3,[A,B,C] }, { 2,[X,Y] }, { 3,[Z,Z1] }]
 */
export function buildRows<T extends { featured: boolean }>(pieces: T[]): Row<T>[] {
  const featured = pieces.filter((p) => p.featured);
  const nonFeatured = pieces.filter((p) => !p.featured);

  // Uniform 3-up: too few total pieces, or no featured pieces to anchor the pattern
  if (pieces.length < 6 || featured.length === 0) {
    return chunkInto(pieces, 3).map((items) => ({ columns: 3, items }));
  }

  // Non-featured pool empty: 2-up all the way down
  if (nonFeatured.length === 0) {
    return chunkInto(featured, 2).map((items) => ({ columns: 2, items }));
  }

  const rows: Row<T>[] = [];
  let fi = 0; // next index into featured
  let ni = 0; // next index into nonFeatured
  let want3up = true; // always start with a 3-up row

  while (fi < featured.length || ni < nonFeatured.length) {
    if (want3up) {
      if (ni < nonFeatured.length) {
        const items = nonFeatured.slice(ni, ni + 3);
        ni += items.length;
        rows.push({ columns: 3, items });
        want3up = false;
      } else {
        // Non-featured exhausted: drain remaining featured into 3-up rows
        while (fi < featured.length) {
          const items = featured.slice(fi, fi + 3);
          fi += items.length;
          rows.push({ columns: 3, items });
        }
        break;
      }
    } else {
      if (fi < featured.length) {
        // Take up to 2; if only 1 remains it renders at 2-up width, left-aligned
        const items = featured.slice(fi, fi + 2);
        fi += items.length;
        rows.push({ columns: 2, items });
        want3up = true;
      } else {
        // Featured exhausted: drain remaining non-featured into 3-up rows
        while (ni < nonFeatured.length) {
          const items = nonFeatured.slice(ni, ni + 3);
          ni += items.length;
          rows.push({ columns: 3, items });
        }
        break;
      }
    }
  }

  return rows;
}

function chunkInto<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
