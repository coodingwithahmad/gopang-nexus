const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn what you are trying to improve, where the current process breaks down, and what success should look like before suggesting a solution.",
  },
  {
    number: "02",
    title: "Scoping",
    description:
      "We define the work, the technical approach, the timeline, and what is not included, so expectations are clear before development starts.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We build in practical stages, share progress, and keep decisions visible so the final product matches the business need, not just the original guess.",
  },
  {
    number: "04",
    title: "Handover",
    description:
      "We hand over the system with documentation, credentials, and support so your team can use it confidently after launch.",
  },
];

export function ProcessSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20">
        <div className="max-w-lg mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            A process that keeps the work clear
          </h2>
          <p className="mt-2 text-muted-foreground">
            No vague promises, no mystery timelines. Each project starts with a
            clear scope and moves forward in visible stages.
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
