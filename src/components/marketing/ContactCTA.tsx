import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="border-t border-border bg-muted/25 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-14">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight">
            Need a system that works better than the current one?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Tell us what is slowing the business down. We will review it and
            respond with a practical next step.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start the conversation
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              Book a consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
