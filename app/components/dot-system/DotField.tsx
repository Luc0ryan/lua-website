// Parent must be `position: relative` (or absolute/fixed/sticky) for this
// absolutely-positioned layer to fill it correctly.

interface DotFieldProps {
  dotColor?: string;
  dotSize?: number;  // dot diameter in px
  spacing?: number;  // center-to-center grid pitch in px
  opacity?: number;  // 0–1
  // Blur applied to the background layer for a printed-on-paper feel.
  // Increase toward 1–2px if dots feel too crisp; set to 0 to disable.
  // The gradient stops (25% / 65%) are the primary softness control — adjust
  // those in the backgroundImage string if you want to change edge crispness
  // without affecting the overall blur budget.
  softness?: number;
  className?: string;
}

export function DotField({
  dotColor = "#C91F6E",
  dotSize = 3,
  spacing = 24,
  opacity = 0.5,
  softness = 0.4,
  className,
}: DotFieldProps) {
  // Express dot radius as a percentage of the background-size tile so the
  // gradient scales correctly regardless of spacing.
  const radiusPct = ((dotSize / 2) / spacing) * 100;

  // Soft stops: solid core to 25% of radius, transparent by 65%.
  // Widen the gap (e.g. 20% → 70%) for softer dots; narrow it for harder edges.
  const backgroundImage = [
    `radial-gradient(circle,`,
    `  ${dotColor} 0%,`,
    `  ${dotColor} ${radiusPct * 0.25}%,`,
    `  transparent ${radiusPct * 0.65}%`,
    `)`,
  ].join(" ");

  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage,
    backgroundSize: `${spacing}px ${spacing}px`,
    // Phase-consistent: fixed origin so adjacent DotField instances align.
    backgroundPosition: "0 0",
    opacity,
    // softness > 0 adds a subtle sub-pixel blur over the background layer,
    // reinforcing the printed-ink feel. Keep below ~1px to avoid destroying
    // the dot shape; set to 0 to rely solely on the gradient soft stops.
    filter: softness > 0 ? `blur(${softness}px)` : undefined,
    pointerEvents: "none",
  };

  return <div style={style} className={className} aria-hidden="true" />;
}
