import Image from "next/image";

// "IMAGINATION IS OUR CRAFT" editorial block — Figma node 1140:1591.
// Title over a body row over a four-tile mosaic filled with the edit photos,
// ordered left-to-right, top-to-bottom (edit1 feature, edit2 middle, edit3/4 stack).
export default function Editorial() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-gutter py-10">
      <div className="flex flex-col gap-10">
        <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-normal uppercase leading-none text-fg">
          Imagination is our craft
        </h2>

        <p className="max-w-[687px] font-body text-xl leading-normal text-fg">
          We don&rsquo;t think any project has a single right answer. The work gets better when
          more people have a hand in it, so we leave room in almost everything we build for someone
          else to step in and make it theirs.
          <br />
          <br />
          Whatever we&rsquo;re making and wherever it ends up, the care is the same.
        </p>

        {/* Mosaic: big feature | tall narrow | two stacked squares — ~2:1:1 columns.
            The feature column owns an explicit aspect-ratio, so the fill image always
            has a definite height from its own width — never borrowed from grid tracks
            (which can collapse to 0). The other columns stretch to match its height. */}
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[2px] bg-neutral-200">
            <Image
              src="/images/edit1.webp"
              alt="Editorial photo"
              fill
              sizes="(max-width: 768px) 50vw, 512px"
              className="object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-[2px] bg-neutral-200">
            <Image
              src="/images/edit2.webp"
              alt="Editorial photo"
              fill
              sizes="(max-width: 768px) 25vw, 256px"
              className="object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="relative overflow-hidden rounded-[2px] bg-neutral-200">
              <Image
                src="/images/edit3.webp"
                alt="Editorial photo"
                fill
                sizes="(max-width: 768px) 25vw, 256px"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden rounded-[2px] bg-neutral-200">
              <Image
                src="/images/edit4.webp"
                alt="Editorial photo"
                fill
                sizes="(max-width: 768px) 25vw, 256px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
