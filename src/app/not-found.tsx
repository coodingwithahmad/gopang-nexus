import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
