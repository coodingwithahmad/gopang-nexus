import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
          GOPANG IT SOLUTION
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
          Software your team can actually use.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
          We build websites, business applications, and internal tools for
          companies that need software that fits how they work — and stays
          maintainable as they grow.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Get in touch
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            See what we do
          </Link>
        </div>
      </div>
    </section>
  );
}
