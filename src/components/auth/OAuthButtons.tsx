import { Apple } from "lucide-react";
import { oauthSignInAction } from "@/lib/actions/auth";

export function OAuthButtons({ next = "/dashboard" }: { next?: string }) {
  const googleAction = oauthSignInAction.bind(null, "google");
  const appleAction = oauthSignInAction.bind(null, "apple");

  return (
    <div className="space-y-3">
      <form action={googleAction}>
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-semibold">
            G
          </span>
          Continue with Google
        </button>
      </form>

      <form action={appleAction}>
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Apple size={17} />
          Continue with Apple
        </button>
      </form>
    </div>
  );
}
