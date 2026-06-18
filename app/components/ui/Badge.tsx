type Variant = "default" | "pink" | "solid";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: "text-fg/50",
  pink: "text-pink",
  solid: "bg-fg text-bg px-2 py-0.5",
};

function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-sans font-semibold tracking-widest uppercase ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { Variant as BadgeVariant };
