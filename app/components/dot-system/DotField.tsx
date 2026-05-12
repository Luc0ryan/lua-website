// Parent must be `position: relative` (or absolute/fixed/sticky) for this
// absolutely-positioned layer to fill it correctly.

// MAX_FILL: dot diameter can reach at most 90% of the cell pitch before dots
// visually merge. At intensity=1 you get ~90% fill; at intensity=0.5 you get
// ~45% fill — the classic Lichtenstein halftone mid-tone.
const MAX_FILL = 0.9;

interface DotFieldProps {
  dotColor?: string;
  // 0–1: controls dot diameter as a fraction of MAX_FILL × spacing.
  // This is the halftone density knob — larger = bigger dots = more ink.
  // Ignored when dotSize is set explicitly.
  intensity?: number;
  // Explicit diameter override in px. Bypasses intensity when provided.
  dotSize?: number;
  // Center-to-center grid pitch in px.
  spacing?: number;
  opacity?: number; // 0–1
  // Grid rotation in degrees. 45° gives the Lichtenstein diagonal.
  // The layer scales by 1.5 (> √2) so all corners remain covered after rotation.
  angle?: number;
  className?: string;
}

export function DotField({
  dotColor = "#E8197D",
  intensity = 0.55,
  dotSize,
  spacing = 28,
  opacity = 0.45,
  angle = 45,
  className,
}: DotFieldProps) {
  const diameter = dotSize ?? spacing * intensity * MAX_FILL;
  const r = diameter / 2;

  // Hard-edged circle: solid fill to radius, then immediate transparency.
  // This matches Lichtenstein's flat, graphic benday dot style — no soft halos.
  const backgroundImage = `radial-gradient(circle ${r}px at center, ${dotColor} 99%, transparent 100%)`;

  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage,
    backgroundSize: `${spacing}px ${spacing}px`,
    backgroundPosition: "0 0",
    opacity,
    // Rotate the tiling grid and scale out so the rotated layer still covers
    // the full container. 1.5 > √2 ≈ 1.414 which is the minimum needed for a
    // square; use 1.5 to cover tall or wide rectangles with margin to spare.
    transform: angle !== 0 ? `rotate(${angle}deg) scale(1.5)` : undefined,
    transformOrigin: "center center",
    pointerEvents: "none",
  };

  return <div style={style} className={className} aria-hidden="true" />;
}
