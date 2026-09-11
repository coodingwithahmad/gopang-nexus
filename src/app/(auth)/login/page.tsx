"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, Suspense } from "react";
import { loginAction, type AuthActionState } from "@/lib/actions/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

const initialState: AuthActionState = { status: "idle" };

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
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
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
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
        <h1 className="mt-2 text-xl font-bold text-foreground">Client Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>

      <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
        <Suspense fallback={<div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
