import { type ElementType, type HTMLAttributes } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "muted" | "label";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: Size;
  variant?: Variant;
}

const sizeClasses: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const variantClasses: Record<Variant, string> = {
  default: "text-fg",
  muted: "text-fg/50",
  label: "text-xs font-semibold tracking-widest uppercase text-fg/70",
};

function Text({ as: Tag = "p", size = "md", variant = "default", className = "", children, ...props }: TextProps) {
  return (
    <Tag
      className={`font-sans ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { Text };
export type { Size as TextSize, Variant as TextVariant };
