import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="border-t border-border bg-muted/25 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-14">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight">
            Have a project in mind?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Tell us what you&apos;re working on. We&apos;ll respond within one
            business day.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Send us a message
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
