type Step = {
  number: string;
  title: string;
  duration: string;
  body: string;
};

const steps: Step[] = [
  {
    number: "1",
    title: "Research",
    duration: "(2 – 4 weeks)",
    body: "Ground work before groundwork. We get into the site, talk to the people who live near it, and figure out what the light wants to do there. We open the conversation with a direction, not a fixed concept.",
  },
  {
    number: "2",
    title: "Design",
    duration: "(1 – 2 months)",
    body: "We move between hand drawings and light simulation, scale models and site visits, until the concept stops being a proposal and starts being inevitable.",
  },
  {
    number: "3",
    title: "Fabricate",
    duration: "(1 – 3 months)",
    body: "Every custom rig, control system, and structural mount is made for real weather, real crowds, and a decade of use. We fabricate everything in-house.",
  },
  {
    number: "4",
    title: "Install",
    duration: "(1+ weeks)",
    body: "Our team is on site from first rigging to final sequence. We work alongside your crew, solving problems in real time, and making sure nothing gets lost in translation between the design and the ground.",
  },
];

export default function CommissionProcess() {
  return (
    <section className="pt-16 pb-16">
      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`flex flex-col gap-3 py-12 md:flex-row md:items-start md:justify-between md:gap-10 ${
              i > 0 ? "border-t-2 border-fg" : ""
            }`}
          >
            <div className="flex items-baseline gap-4 md:w-[17.5rem] md:shrink-0">
              <span className="font-heading font-light text-4xl text-gray-label tracking-tight">
                {step.number}
              </span>
              <div className="flex flex-col">
                <span className="font-heading font-medium text-3xl md:text-4xl text-fg tracking-tight">
                  {step.title}
                </span>
                <span className="font-sans text-lg text-text-muted">{step.duration}</span>
              </div>
            </div>
            <p className="font-sans text-base text-fg md:max-w-[37.5rem]">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
