export type Row<T extends { featured?: boolean }> = {
  columns: 2 | 3;
  items: T[];
};

/**
 * Splits a sorted array of pieces into alternating 3-up / 2-up rows.
 *
 * Rules:
 *   - Pieces with featured=true  → fill 2-up rows (every other row starting at index 1)
 *   - Pieces with featured=false → fill 3-up rows (every other row starting at index 0)
 *   - Fewer than 6 total pieces  → skip asymmetric pattern, uniform 3-up
 *   - Either pool exhausted first → remaining pool fills uniform rows of its own column count
 *
 * The function is pure: same input always produces same output.
 *
 * Edge-case examples (input → output):
 *
 *   // 1. Fewer than 6 pieces — uniform 3-up regardless of featured flags
 *   buildRows([NF,NF,NF,NF])
 *   // → [{ columns:3, items:[NF,NF,NF] }, { columns:3, items:[NF] }]
 *
 *   // 2. Featured pool empty — uniform 3-up
 *   buildRows([NF,NF,NF, NF,NF,NF, NF,NF,NF])
 *   // → [{ columns:3, items:[NF×3] }, { columns:3, items:[NF×3] }, { columns:3, items:[NF×3] }]
 *
 *   // 3. Non-featured pool empty — 2-up rows throughout
 *   buildRows([F,F,F,F])
 *   // → [{ columns:2, items:[F,F] }, { columns:2, items:[F,F] }]
 *
 *   // 4. Normal alternation: 3 non-featured, 2 featured
 *   buildRows([NF,NF,NF, F,F])
 *   // → [{ columns:3, items:[NF,NF,NF] }, { columns:2, items:[F,F] }]
 *
 *   // 5. 1 leftover non-featured card — 33% width, left-aligned (columns:3, items:[NF])
 *   buildRows([NF,NF,NF,NF, F,F])
 *   // → [{ columns:3, items:[NF,NF,NF] }, { columns:2, items:[F,F] }, { columns:3, items:[NF] }]
 *
 *   // 6. 1 leftover featured card — 2-up-width, left-aligned (columns:2, items:[F])
 *   buildRows([NF,NF,NF, F,F,F])
 *   // → [{ columns:3, items:[NF,NF,NF] }, { columns:2, items:[F,F] }, { columns:2, items:[F] }]
 *
 *   // 7. Non-featured exhausted mid-pattern — remaining featured fill 2-up rows
 *   buildRows([NF,NF,NF, F,F,F,F])
 *   // → [{ columns:3, items:[NF,NF,NF] }, { columns:2, items:[F,F] }, { columns:2, items:[F,F] }]
 *
 *   // 8. Featured exhausted mid-pattern — remaining non-featured fill 3-up rows
 *   buildRows([NF,NF,NF, NF,NF,NF, F,F])
 *   // → [{ columns:3, items:[NF,NF,NF] }, { columns:2, items:[F,F] }, { columns:3, items:[NF,NF,NF] }]
 */
export function buildRows<T extends { featured?: boolean }>(pieces: T[]): Row<T>[] {
  const featured = pieces.filter((p) => p.featured);
  const nonFeatured = pieces.filter((p) => !p.featured);

  if (pieces.length < 6 || featured.length === 0) {
    return chunk(nonFeatured.concat(featured), 3).map((items) => ({ columns: 3, items }));
  }

  if (nonFeatured.length === 0) {
    return chunk(featured, 2).map((items) => ({ columns: 2, items }));
  }

  const rows: Row<T>[] = [];
  let fi = 0;
  let ni = 0;
  let rowIndex = 0;

  while (fi < featured.length || ni < nonFeatured.length) {
    if (rowIndex % 2 === 0) {
      // 3-up row: pull from non-featured pool
      if (ni < nonFeatured.length) {
        rows.push({ columns: 3, items: nonFeatured.slice(ni, ni + 3) });
        ni += 3;
      } else {
        // non-featured exhausted — drain featured in 2-up rows
        while (fi < featured.length) {
          rows.push({ columns: 2, items: featured.slice(fi, fi + 2) });
          fi += 2;
        }
        break;
      }
    } else {
      // 2-up row: pull from featured pool
      if (fi < featured.length) {
        rows.push({ columns: 2, items: featured.slice(fi, fi + 2) });
        fi += 2;
      } else {
        // featured exhausted — drain non-featured in 3-up rows
        while (ni < nonFeatured.length) {
          rows.push({ columns: 3, items: nonFeatured.slice(ni, ni + 3) });
          ni += 3;
        }
        break;
      }
    }
    rowIndex++;
  }

  return rows;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
