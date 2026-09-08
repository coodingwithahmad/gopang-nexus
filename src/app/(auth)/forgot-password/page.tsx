"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

const initialState: AuthActionState = { status: "idle" };

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground tracking-tight"
        >
          {siteConfig.shortName}
          <span className="text-primary">.</span>
        </Link>
        <h1 className="mt-2 text-xl font-bold text-foreground">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
        {state.status === "success" ? (
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            {state.status === "error" && (
              <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
