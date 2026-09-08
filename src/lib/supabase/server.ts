import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * IMPORTANT: Always use supabase.auth.getUser() for auth checks — NOT getSession().
 * getSession() reads from the cookie and doesn't verify the JWT server-side.
 * getUser() makes a network request to Supabase and is authoritative.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Components where cookies can't be set.
            // This is safe to ignore — the middleware handles session refresh.
          }
        },
      },
    }
  );
}
