import Image from "next/image";

export default function CommissionHero() {
  return (
    <div className="relative h-[88vh] min-h-[560px] w-full">
      <Image
        src="/images/commission/hero.jpg"
        alt="A telehandler lifts a large sculpted head onto its base at a Looking Up Art fabrication yard"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        quality={90}
      />
    </div>
  );
}
