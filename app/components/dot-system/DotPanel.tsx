import { DotField } from "./DotField";
import { DotMask, type MaskShape } from "./DotMask";

interface DotPanelProps {
  // DotField props
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  opacity?: number;
  softness?: number;
  // DotMask props
  shape?: MaskShape;
  intensityRange?: [number, number];
  className?: string;
}

export function DotPanel({
  dotColor,
  dotSize,
  spacing,
  opacity,
  softness,
  shape,
  intensityRange,
  className,
}: DotPanelProps) {
  return (
    <DotMask shape={shape} intensityRange={intensityRange} className={className}>
      <DotField
        dotColor={dotColor}
        dotSize={dotSize}
        spacing={spacing}
        opacity={opacity}
        softness={softness}
      />
    </DotMask>
  );
}
