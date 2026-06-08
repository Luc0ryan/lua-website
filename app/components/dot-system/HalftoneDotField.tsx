"use client";

import { useRef, useEffect } from "react";

interface HalftoneDotFieldProps {
  dotColor?: string;
  // Max dot radius at the densest point (top). Min radius fades to 0 at bottom.
  maxRadius?: number;
  // Center-to-center grid pitch in px.
  spacing?: number;
  opacity?: number;
  // Rotation of the dot grid in degrees.
  angle?: number;
  className?: string;
}

export function HalftoneDotField({
  dotColor = "#1a1a1a",
  maxRadius,
  spacing = 14,
  opacity = 1,
  angle = 45,
  className,
}: HalftoneDotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
    const W = Math.round(cssW * dpr);
    const H = Math.round(cssH * dpr);
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = dotColor;

    const s = spacing * dpr;
    const rMax = (maxRadius ?? spacing * 0.45) * dpr;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // How many grid rows/cols we need to cover the diagonal of the canvas
    const diag = Math.ceil(Math.sqrt(W * W + H * H));
    const steps = Math.ceil(diag / s) + 2;

    const cx = W / 2;
    const cy = H / 2;

    for (let i = -steps; i <= steps; i++) {
      for (let j = -steps; j <= steps; j++) {
        // Grid point in rotated space
        const gx = cx + (i * cos - j * sin) * s;
        const gy = cy + (i * sin + j * cos) * s;

        // Skip dots outside the canvas (with a small margin)
        if (gx < -rMax || gx > W + rMax || gy < -rMax || gy > H + rMax) continue;

        // t = 0 at top, 1 at bottom — dot radius scales from rMax → 0
        const t = gy / H;
        const r = rMax * Math.max(0, 1 - t);
        if (r < 0.5) continue;

        ctx.beginPath();
        ctx.arc(gx, gy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [dotColor, maxRadius, spacing, opacity, angle]);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className={`absolute inset-0 w-full h-full pointer-events-none${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
