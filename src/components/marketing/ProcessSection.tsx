const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start with a conversation about what you're trying to solve. We ask questions, review what you already have, and understand how your team works before proposing anything.",
  },
  {
    number: "02",
    title: "Scoping",
    description:
      "We document what needs to be built, the technical approach, and what's out of scope. You get a clear proposal with a timeline and fixed or estimated cost before any work begins.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We build in stages and keep you updated throughout. You can see progress, give feedback, and request adjustments before the project is finalized.",
  },
  {
    number: "04",
    title: "Handover",
    description:
      "When the project is complete, we document how it works, transfer all assets, and make sure your team knows how to use and manage what was built.",
  },
];

export function ProcessSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20">
        <div className="max-w-lg mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            How we work
          </h2>
          <p className="mt-2 text-muted-foreground">
            A straightforward process designed to keep projects on track and
            clients informed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <p className="text-3xl font-bold text-border">{step.number}</p>
              <h3 className="mt-3 font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
