/**
 * Ben Day dot field — a self-contained Lichtenstein halftone band that sits
 * directly above the featured image.
 *
 * Render inside a `relative` cell as a sibling of the image. It anchors to
 * `bottom-full` (the 36px gap between the section rule and the image) and clips
 * its own dots with `overflow-hidden`, so there's no bleed below the image and
 * the crop stays a crisp rectangle regardless of how tall the cell grows.
 *
 * Texture is true Ben-Day: two offset radial-gradients form a 45° staggered
 * lattice (dots align on diagonals, not a square grid) with dots that nearly
 * touch — dense intensity, but a finer dot than a chunky polka grid. Fixed in
 * px so size/gap stay constant at any section height. ~4 rows tall. Hidden on
 * mobile.
 */
export default function BenDayField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-full left-0 hidden h-9 w-full overflow-hidden md:block"
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--fg) 32%, transparent 34%), radial-gradient(circle, var(--fg) 32%, transparent 34%)",
        backgroundSize: "18px 18px",
        backgroundPosition: "0 0, 9px 9px",
      }}
    />
  );
}
