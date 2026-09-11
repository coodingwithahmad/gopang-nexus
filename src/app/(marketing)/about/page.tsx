import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "GOPANG IT SOLUTION builds practical websites, business applications, and internal systems for growing companies.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About GOPANG IT SOLUTION
          </h1>

          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            <p>
              GOPANG IT SOLUTION is an IT services company for businesses that
              need practical software, not complicated technology for its own
              sake. We build websites, business applications, client portals,
              and internal tools that solve clear operational problems.
            </p>
            <p>
              Our clients usually come to us when a process has outgrown
              spreadsheets, manual follow-ups, disconnected tools, or a website
              that no longer represents the business well. We help turn those
              problems into clear systems that are easier to use, easier to
              manage, and easier to improve over time.
            </p>
            <p>
              We prefer honest scoping over vague promises. Before development
              starts, we define what needs to be built, what it should cost,
              how long it should take, and where the risks are. That gives both
              sides a better project from the beginning.
            </p>
            <p>
              After launch, we hand over the work properly with documentation,
              credentials, and support. The goal is simple: your business
              should understand and trust the system it depends on.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              What we believe good software should do
            </h2>
            <dl className="space-y-4">
              {[
                {
                  term: "Support the way the business works",
                  def: "The system should fit the real workflow, not force the team into unnecessary steps.",
                },
                {
                  term: "Make important information easier to find",
                  def: "Good software gives the right people access to the right information without confusion.",
                },
                {
                  term: "Stay understandable after launch",
                  def: "We build with clean structure, documentation, and handover in mind from the start.",
                },
                {
                  term: "Avoid complexity that does not pay for itself",
                  def: "If a simpler solution solves the problem well, that is usually the better solution.",
                },
              ].map(({ term, def }) => (
                <div key={term} className="border-l-2 border-primary pl-4">
                  <dt className="font-medium text-foreground text-sm">{term}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border p-6">
            <h2 className="font-semibold text-foreground mb-3">
              Work with us
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tell us what you need to improve. We will review it and respond
              with a practical next step.
            </p>
            <Link
              href="/contact"
              className="block text-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start a conversation
            </Link>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h2 className="font-semibold text-foreground mb-3">Contact</h2>
            <p className="text-sm text-muted-foreground">
              hello@gopangit.com
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
