import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "GOPANG IT SOLUTION builds websites, business applications, and internal tools for companies that need software they can actually use.",
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
              GOPANG IT SOLUTION is an IT services company focused on building
              software that solves real business problems — websites, internal
              tools, client portals, and business applications for companies
              that need something specific.
            </p>
            <p>
              We work with businesses in a range of industries. The work varies:
              sometimes it&apos;s a company website, sometimes it&apos;s a
              system to replace a spreadsheet that 20 people are sharing, and
              sometimes it&apos;s a client-facing portal for a professional
              services firm. What most of our projects have in common is that
              the client needed something specific, not a generic tool.
            </p>
            <p>
              Our process is straightforward. We start with a conversation to
              understand the problem, then scope the work clearly before
              starting. You&apos;ll know what you&apos;re getting, what
              it&apos;ll cost, and when it&apos;ll be ready before we begin.
            </p>
            <p>
              When a project is done, we hand it over properly — with
              documentation, credentials, and support for your team to take
              ownership of what was built.
            </p>
          </div>

          {/* What we value */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              How we approach work
            </h2>
            <dl className="space-y-4">
              {[
                {
                  term: "Specificity over templates",
                  def: "We build to your requirements, not from a generic template that was designed for every business at once.",
                },
                {
                  term: "Clear scope before any work starts",
                  def: "We document what's being built and what's not. Surprises mid-project are avoidable, and we try to avoid them.",
                },
                {
                  term: "Code you can maintain",
                  def: "We don't write code that only we can understand. Everything we build should be approachable by any competent developer after we hand it over.",
                },
                {
                  term: "No unnecessary complexity",
                  def: "If a simpler solution works, we use it. We don't add technology for the sake of it.",
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
              If you have a project in mind, tell us about it. We&apos;ll
              respond within one business day.
            </p>
            <Link
              href="/contact"
              className="block text-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get in touch
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
