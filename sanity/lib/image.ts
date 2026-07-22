import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Staff photos are always rendered in grayscale, regardless of whether the
// uploaded source is color or already black-and-white — sat=-100 is a no-op
// on a photo that has no saturation left to remove.
export function staffPhotoUrl(source: SanityImageSource) {
  return builder.image(source).saturation(-100);
}
