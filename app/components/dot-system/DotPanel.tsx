import { DotField, type DotVariant } from "./DotField";
import { DotMask, type MaskShape } from "./DotMask";

interface DotPanelProps {
  // DotField props
  dotColor?: string;
  intensity?: number;
  dotSize?: number;
  spacing?: number;
  opacity?: number;
  angle?: number;
  variant?: DotVariant;
  // DotMask props
  shape?: MaskShape;
  intensityRange?: [number, number];
  className?: string;
}

export function DotPanel({
  dotColor,
  intensity,
  dotSize,
  spacing,
  opacity,
  angle,
  variant,
  shape,
  intensityRange,
  className,
}: DotPanelProps) {
  return (
    <DotMask shape={shape} intensityRange={intensityRange} className={className}>
      <DotField
        dotColor={dotColor}
        intensity={intensity}
        dotSize={dotSize}
        spacing={spacing}
        opacity={opacity}
        angle={angle}
        variant={variant}
      />
    </DotMask>
  );
}
