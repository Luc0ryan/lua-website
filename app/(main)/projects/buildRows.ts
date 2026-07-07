export type Row<T> = {
  columns: 2 | 3;
  items: T[];
};

/**
 * Splits an ordered array of pieces into alternating 3-up / 2-up rows.
 * Pieces flow strictly in order — no pool separation.
 * Row 0: 3 items, Row 1: 2 items, Row 2: 3 items, ...
 */
export function buildRows<T>(pieces: T[]): Row<T>[] {
  const rows: Row<T>[] = [];
  let i = 0;
  let rowIndex = 0;

  while (i < pieces.length) {
    const size = rowIndex % 2 === 0 ? 3 : 2;
    rows.push({ columns: size as 2 | 3, items: pieces.slice(i, i + size) });
    i += size;
    rowIndex++;
  }

  return rows;
}
