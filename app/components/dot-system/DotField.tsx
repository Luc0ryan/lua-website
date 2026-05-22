// Parent must be `position: relative` (or absolute/fixed/sticky) for this
// absolutely-positioned layer to fill it correctly.

import { useId } from "react";

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
  angle?: number;
  className?: string;
}

export function DotField({
  dotColor = "#DC738F",
  intensity = 0.35,
  dotSize,
  spacing = 10,
  opacity = 0.15,
  angle = 45,
  className,
}: DotFieldProps) {
  const uid = useId();
  // useId returns strings like ":r0:" — colons are invalid in SVG id attributes.
  const patternId = `dot-${uid.replace(/:/g, "")}`;

  const diameter = dotSize ?? spacing * intensity * MAX_FILL;
  const r = diameter / 2;

  // Tile side = spacing * √2 so that when the tile is rotated by `angle` the
  // repeat-unit boundaries land exactly on dot centers. A plain spacing × spacing
  // tile would shift the seam into the middle of a cell after rotation.
  const tileSize = spacing * Math.SQRT2;
  const tileCenter = tileSize / 2;

  return (
    <svg
      style={{ opacity }}
      className={`absolute inset-0 w-full h-full pointer-events-none${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
          patternTransform={angle !== 0 ? `rotate(${angle})` : undefined}
        >
          <circle cx={tileCenter} cy={tileCenter} r={r} fill={dotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
