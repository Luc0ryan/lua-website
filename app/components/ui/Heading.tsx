import { type ElementType, type HTMLAttributes } from "react";

type Level = "display" | "h1" | "h2" | "h3" | "h4";
type Weight = "normal" | "medium" | "semibold" | "bold";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  as?: ElementType;
  /** Overrides the level's default weight. */
  weight?: Weight;
}

// Fluid hero/section-opener size — bigger than h1 and scales continuously
// with viewport instead of stepping at a breakpoint. Use for one-off
// display moments, not routine section headings.
const levelSize: Record<Level, string> = {
  display: "text-[clamp(2.5rem,6vw,4rem)] leading-none",
  h1: "text-5xl md:text-6xl",
  h2: "text-4xl",
  h3: "text-2xl",
  h4: "text-xl",
};

const levelWeight: Record<Level, Weight> = {
  display: "bold",
  h1: "bold",
  h2: "bold",
  h3: "medium",
  h4: "medium",
};

// Weight is applied as a single utility class chosen here, rather than
// letting a className override collide with the level's own font-* class —
// Tailwind doesn't resolve two conflicting utilities by source order.
const weightClass: Record<Weight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

function Heading({ level = "h2", as, weight, className = "", children, ...props }: HeadingProps) {
  // "display" isn't a real HTML tag — callers should pass `as` for it,
  // but fall back to h1 so a missed `as` still renders a real heading.
  const Tag = (as ?? (level === "display" ? "h1" : level)) as ElementType;
  const resolvedWeight = weightClass[weight ?? levelWeight[level]];
  return (
    <Tag className={`font-heading ${levelSize[level]} ${resolvedWeight} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export { Heading };
export type { Level as HeadingLevel };
