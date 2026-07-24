import Image from "next/image";

type ValueCard = {
  image: string;
  alt: string;
  title: string;
  body: string;
};

const cards: ValueCard[] = [
  {
    image: "/images/commission/value-1.png",
    alt: "A fabricator welding a large-scale sculpture in the Looking Up Art workshop",
    title: "We know how cities work",
    body: "Codes, public-safety review, stakeholder approvals, and civic art calls from finalist round to installation, plus the faster worlds of festivals and private events.",
  },
  {
    image: "/images/commission/value-2.jpg",
    alt: "A designer hand-painting a detail on a commissioned piece",
    title: "We design to your number",
    body: "When ambition and budget collide, we scope the version that keeps the vision whole and we raise the hard cost questions early, never when it’s too late.",
  },
  {
    image: "/images/commission/value-3.jpg",
    alt: "An illuminated Looking Up Art installation at night on a city street",
    title: "You hear it from us first",
    body: "We ask the questions clients hesitate to raise, plan for the unknowns every install uncovers, and deliver hard news the day we learn it.",
  },
];

export default function CommissionValueGrid() {
  return (
    <section className="pt-8 md:pt-10 pb-16 md:pb-24">
      <div className="grid grid-cols-1 gap-x-6 gap-y-24 sm:grid-cols-3 sm:gap-y-0">
        {cards.map((card, i) => (
          <div key={card.title} className={i === 1 ? "sm:mt-8" : ""}>
            <div className="relative aspect-336/448 w-full overflow-hidden rounded-xs">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 100vw, 336px"
                className="object-cover"
              />
            </div>
            <div className="relative z-10 -mt-24 ml-0 flex w-[90%] flex-col gap-1 rounded-xs border-2 border-purple-commission bg-white p-4">
              <p className="font-heading font-medium text-2xl tracking-tight text-fg">
                {card.title}
              </p>
              <p className="font-sans text-base text-fg">{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
