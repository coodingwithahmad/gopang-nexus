"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
          <div className="text-center max-w-sm">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Error
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="mt-3 text-muted-foreground text-sm">
              An unexpected error occurred. Your data has not been affected.
              {error.digest && (
                <span className="block mt-1 font-mono text-xs text-muted-foreground/60">
                  Ref: {error.digest}
                </span>
              )}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
