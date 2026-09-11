import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GOPANG IT SOLUTION to discuss a website, business application, internal tool, or support request.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tell us what you need to improve
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Share the problem, the goal, or the system you have in mind. We
            will review it and respond with a practical next step.
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <h2 className="font-semibold text-foreground mb-2">Email</h2>
            <p className="text-sm text-muted-foreground">
              <a
                href="mailto:hello@gopangit.com"
                className="text-primary hover:underline"
              >
                hello@gopangit.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-2">Response time</h2>
            <p className="text-sm text-muted-foreground">
              Most enquiries receive a reply within one business day. Existing
              clients can use the portal for project questions and support
              tickets.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-2">
              Before you write
            </h2>
            <p className="text-sm text-muted-foreground">
              A complete brief is not required. A clear description of what is
              not working, what you want to build, or what decision you need to
              make is enough to start.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
