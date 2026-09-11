import type { Metadata } from "next";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a practical consultation for a website, business application, internal system, or IT decision.",
};

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Book a consultation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Send us the context first so the call can be useful. We will review
            your submission and get back to you with the best next step,
            usually within one business day.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            The consultation is free. If we are not the right fit, we will tell
            you honestly.
          </p>

          <div className="mt-8">
            <ConsultationForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <h2 className="font-semibold text-foreground mb-2">
              What to expect
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "We will read your submission before the call",
                "The call is focused on the business problem, not a sales pitch",
                "We will ask about workflow, users, budget, and risk",
                "You will get an honest view of what should happen next",
                "If there is a fit, we will outline a sensible project path",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-2">
              Prefer email?
            </h2>
            <p className="text-sm text-muted-foreground">
              You can also reach us directly at{" "}
              <a
                href="mailto:hello@gopangit.com"
                className="text-primary hover:underline"
              >
                hello@gopangit.com
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
