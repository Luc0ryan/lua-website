import type { GalleryImage } from "@/sanity/lib/queries";

export type GalleryRow = { size: "large" | "small"; items: GalleryImage[] };

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
    if (img.size === "large") {
      flushSmall();
      rows.push({ size: "large", items: [img] });
    } else {
      smallBuffer.push(img);
    }
  }
  flushSmall();

  return rows;
}
