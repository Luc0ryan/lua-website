import type { ReactNode, CSSProperties } from "react";

export type MaskShape =
  | "none"
  | "fade-top"
  | "fade-bottom"
  | "fade-left"
  | "fade-right"
  | "diagonal-tlbr"
  | "diagonal-trbl"
  | "radial-center"  // opaque center, fades to transparent at edges
  | "radial-edges"   // transparent center, opaque at edges
  | "peak";          // transparent top → opaque middle → transparent bottom

interface DotMaskProps {
  shape?: MaskShape;
  // [minAlpha, maxAlpha] — controls the alpha range of the mask gradient.
  // e.g. [0, 0.6] caps visibility at 60% even at the densest mask point.
  intensityRange?: [number, number];
  className?: string;
  children: ReactNode;
}

function buildMaskValue(
  shape: MaskShape,
  [lo, hi]: [number, number],
): string | undefined {
  const a = (alpha: number) => `rgba(0,0,0,${alpha})`;

  switch (shape) {
    case "none":
      return undefined;
    case "fade-top":
      return `linear-gradient(to bottom, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "fade-bottom":
      return `linear-gradient(to top, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "fade-left":
      return `linear-gradient(to right, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "fade-right":
      return `linear-gradient(to left, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "diagonal-tlbr":
      return `linear-gradient(to bottom right, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "diagonal-trbl":
      return `linear-gradient(to bottom left, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "radial-center":
      return `radial-gradient(circle at center, ${a(hi)} 0%, ${a(lo)} 100%)`;
    case "radial-edges":
      return `radial-gradient(circle at center, ${a(lo)} 0%, ${a(hi)} 100%)`;
    case "peak":
      return `linear-gradient(to bottom, ${a(lo)} 0%, ${a(hi)} 35%, ${a(hi)} 70%, ${a(lo)} 100%)`;
  }
}

export function DotMask({
  shape = "none",
  intensityRange = [0, 1],
  className,
  children,
}: DotMaskProps) {
  const maskValue = buildMaskValue(shape, intensityRange);

  const style: CSSProperties = {
    overflow: "hidden",
    ...(maskValue != null
      ? ({ maskImage: maskValue, WebkitMaskImage: maskValue } as CSSProperties)
      : {}),
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}
