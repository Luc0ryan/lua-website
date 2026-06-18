import { type ElementType, type HTMLAttributes } from "react";

type Level = "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  as?: ElementType;
}

const levelClasses: Record<Level, string> = {
  h1: "text-5xl md:text-6xl",
  h2: "text-4xl",
  h3: "text-2xl",
  h4: "text-xl",
};

function Heading({ level = "h2", as, className = "", children, ...props }: HeadingProps) {
  const Tag = (as ?? level) as ElementType;
  return (
    <Tag
      className={`font-heading font-bold uppercase ${levelClasses[level]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { Heading };
export type { Level as HeadingLevel };
