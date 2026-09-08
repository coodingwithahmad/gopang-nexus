import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with GOPANG IT SOLUTION. We respond within one business day.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Tell us about your project and we&apos;ll respond within one
            business day.
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
              We respond to all enquiries within one business day. For urgent
              support, existing clients can open a ticket through the client
              portal.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-2">
              Before you write
            </h2>
            <p className="text-sm text-muted-foreground">
              The more specific you can be about what you need, the faster we
              can give you a useful response. We don&apos;t require a full
              brief — just an honest description of the problem.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
