import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the OAuth/magic link/password-reset callback from Supabase.
 * Exchanges the code for a session and redirects to the intended destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Only allow redirects to internal paths — prevent open redirect
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Something went wrong — redirect to login with an error indicator
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
