import { createImageUrlBuilder } from "@sanity/image-url";
import { projectId, dataset } from "./env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Staff photos are always rendered in grayscale, regardless of whether the
// uploaded source is color or already black-and-white — sat=-100 is a no-op
// on a photo that has no saturation left to remove.
export function staffPhotoUrl(source: SanityImageSource) {
  return builder.image(source).saturation(-100);
}
