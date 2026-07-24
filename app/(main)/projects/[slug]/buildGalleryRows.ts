import type { GalleryImage } from "@/sanity/lib/queries";

export type GalleryRow = { size: "large" | "small"; items: GalleryImage[] };

// Landscape shots (wide enough to read as "standout") get their own
// full-width row; anything squarer/portrait reads as a candid and groups
// into rows of up to 3. No manual toggle — classified from the asset's own
// aspect ratio so the gallery field stays a plain, batch-uploadable array.
const LANDSCAPE_THRESHOLD = 1.3;

function isLarge(img: GalleryImage): boolean {
  return (img.aspectRatio ?? 0) >= LANDSCAPE_THRESHOLD;
}

// Each "large" image gets its own full-width row. Consecutive "small"
// images group into rows of up to 3, in order.
export function buildGalleryRows(images: GalleryImage[]): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let smallBuffer: GalleryImage[] = [];

  const flushSmall = () => {
    for (let i = 0; i < smallBuffer.length; i += 3) {
      rows.push({ size: "small", items: smallBuffer.slice(i, i + 3) });
    }
    smallBuffer = [];
  };

  for (const img of images) {
    if (isLarge(img)) {
      flushSmall();
      rows.push({ size: "large", items: [img] });
    } else {
      smallBuffer.push(img);
    }
  }
  flushSmall();

  return rows;
}
