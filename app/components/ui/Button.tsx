import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "brutalist" | "solid" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-sm px-6 py-3.5",
};

const variantClasses: Record<Variant, string> = {
  brutalist:
    "border border-fg bg-bg text-fg font-body font-medium tracking-wide shadow-[3px_3px_0px_#111111] transition-all duration-150 ease-out hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink",
  solid:
    "bg-fg text-bg font-sans font-semibold tracking-widest rounded transition-opacity duration-150 hover:opacity-80 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink",
  ghost:
    "text-fg font-body font-medium tracking-wide hover:text-pink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", size = "md", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center uppercase cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";

export { Button };
export type { Variant as ButtonVariant, Size as ButtonSize };
