import { useEffect, useRef } from "react";
import { set, unset, useFormValue, type SlugInputProps } from "sanity";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// Mirrors the `title` field into the slug live, the way Wix and most
// site builders do — no "Generate" click needed. Once someone types
// directly into the slug field it detaches and stops following title,
// until the slug is cleared back to empty.
export function AutoSlugInput(props: SlugInputProps) {
  const { onChange, value } = props;
  const title = useFormValue(["title"]) as string | undefined;
  const lastAutoSlug = useRef<string>(value?.current ?? "");

  useEffect(() => {
    const currentSlug = value?.current ?? "";
    if (currentSlug !== lastAutoSlug.current && currentSlug !== "") return;

    const nextSlug = title ? slugify(title) : "";
    if (nextSlug === currentSlug) return;

    lastAutoSlug.current = nextSlug;
    onChange(nextSlug ? set({ _type: "slug", current: nextSlug }) : unset());
  }, [title, value, onChange]);

  return props.renderDefault(props);
}
