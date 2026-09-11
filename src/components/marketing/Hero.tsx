import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Subtle Premium Dot Background */}
      <div className="absolute inset-0 bg-dot-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-50" />
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary uppercase tracking-widest mb-6">
            GOPANG IT SOLUTION
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
            Software your team can actually use.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            We build websites, business applications, and internal tools for
            companies that need software that fits how they work — and stays
            maintainable as they grow.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary shadow-lg shadow-primary/20 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Get in touch
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              See what we do
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
