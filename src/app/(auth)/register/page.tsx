"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthActionState } from "@/lib/actions/auth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

const initialState: AuthActionState = { status: "idle" };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <div className="w-full max-w-sm mx-auto my-16">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground tracking-tight"
        >
          {siteConfig.shortName}
          <span className="text-primary">.</span>
        </Link>
        <h1 className="mt-2 text-xl font-bold text-foreground">Create Your Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join the GOPANG IT SOLUTION client portal
        </p>
      </div>

      <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
        <div className="space-y-5">
          <OAuthButtons />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or use email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form action={formAction} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                required
              />
            </div>

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

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="********"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters and include uppercase, lowercase,
                and a number.
              </p>
            </div>

            {state.status === "error" && (
              <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
                {state.message}
              </p>
            )}

            {state.status === "success" && (
              <p className="text-sm text-success bg-success/5 border border-success/20 rounded-md px-3 py-2">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
