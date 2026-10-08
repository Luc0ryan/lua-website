import Image from "next/image";
import ScrollCue from "@/app/components/ScrollCue";

export default function CommissionHero() {
  return (
    <div className="relative -mt-28 h-svh min-h-[560px] w-full">
      <Image
        src="/images/commission/hero.jpg"
        alt="A telehandler lifts a large sculpted head onto its base at a Looking Up Arts fabrication yard"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        quality={90}
      />
      <ScrollCue />
    </div>
  );
}
