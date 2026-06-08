// Parent must be `position: relative` (or absolute/fixed/sticky) for this
// absolutely-positioned layer to fill it correctly.

import { useId } from "react";
import { HalftoneDotField } from "./HalftoneDotField";

// MAX_FILL: dot diameter can reach at most 90% of the cell pitch before dots
// visually merge. At intensity=1 you get ~90% fill; at intensity=0.5 you get
// ~45% fill — the classic Lichtenstein halftone mid-tone.
const MAX_FILL = 0.9;

export type DotVariant = "ben-day" | "halftone" | "screentone";

interface DotFieldProps {
  dotColor?: string;
  // 0–1: controls dot diameter as a fraction of MAX_FILL × spacing.
  intensity?: number;
  // Explicit diameter override in px. Bypasses intensity when provided.
  dotSize?: number;
  // Center-to-center grid pitch in px.
  spacing?: number;
  opacity?: number; // 0–1
  // Grid rotation in degrees.
  angle?: number;
  /**
   * "ben-day"    — uniform dots on a rotated square grid (classic Lichtenstein)
   * "halftone"   — uniform dots that fade from dense at top to invisible at bottom
   * "screentone" — staggered brick/hex grid, alternate rows offset by ½ pitch
   */
  variant?: DotVariant;
  className?: string;
}

export function DotField({
  dotColor = "#DC738F",
  intensity = 0.35,
  dotSize,
  spacing = 10,
  opacity = 0.30,
  angle = 45,
  variant = "ben-day",
  className,
}: DotFieldProps) {
  const uid = useId();
  const patternId = `dot-${uid.replace(/:/g, "")}`;

  const diameter = dotSize ?? spacing * intensity * MAX_FILL;
  const r = diameter / 2;

  // ── Ben-Day / Halftone: square grid rotated by `angle` ──────────────────
  // Tile side = spacing * √2 so rotated tile seams land on dot centers.
  const tileSize = spacing * Math.SQRT2;
  const tileCenter = tileSize / 2;

  // ── Screentone: brick/hex stagger ────────────────────────────────────────
  // Tile = 2 dots wide × 1 dot tall. Second dot is offset +½ pitch horizontally
  // and +½ pitch vertically, producing the staggered manga screentone look.
  const staggerTileW = spacing;
  const staggerTileH = spacing;

  if (variant === "screentone") {
    return (
      <svg
        style={{ opacity }}
        className={`absolute inset-0 w-full h-full pointer-events-none${className ? ` ${className}` : ""}`}
        aria-hidden="true"
      >
        <defs>
          {/* 2-dot brick tile: col0 at (0,0), col1 at (½,½) */}
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={staggerTileW}
            height={staggerTileH}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={0} cy={0} r={r} fill={dotColor} />
            <circle cx={staggerTileW} cy={0} r={r} fill={dotColor} />
            <circle cx={0} cy={staggerTileH} r={r} fill={dotColor} />
            <circle cx={staggerTileW} cy={staggerTileH} r={r} fill={dotColor} />
            <circle cx={staggerTileW / 2} cy={staggerTileH / 2} r={r} fill={dotColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    );
  }

  if (variant === "halftone") {
    return (
      <HalftoneDotField
        dotColor={dotColor}
        maxRadius={dotSize ? dotSize / 2 : undefined}
        spacing={spacing}
        opacity={opacity}
        angle={angle}
        className={className}
      />
    );
  }

  // ── Ben-Day (default) ─────────────────────────────────────────────────────
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
