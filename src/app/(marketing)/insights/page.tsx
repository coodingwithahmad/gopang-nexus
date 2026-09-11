import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Insights | GOPANG IT SOLUTION",
  description:
    "Practical notes on software, operations, business tools, and technical decisions.",
};

export const revalidate = 0; // Always fetch latest insights

export default async function InsightsPage() {
  let posts = null;
  let error = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    posts = result.data;
    error = result.error;
  }

  if (error || !posts) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Insights
          </h1>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">
            We are preparing practical notes from our work with websites,
            business applications, and internal systems.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Insights
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Practical notes on software decisions, internal tools, maintenance,
          and the trade-offs that matter when technology supports real
          operations.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">
            We are preparing practical notes from our work with websites,
            business applications, and internal systems.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time
                  dateTime={post.published_at || ""}
                  className="text-muted-foreground"
                >
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : "Draft"}
                </time>
                <span className="relative z-10 rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
                  Insight
                </span>
              </div>

              <div className="group relative mt-6">
                <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/insights/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-8 flex items-center text-sm font-medium text-primary">
                Read article{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
