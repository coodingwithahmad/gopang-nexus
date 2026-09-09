import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | GOPANG IT SOLUTION`,
    description: post.excerpt,
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="mb-8">
        <Link
          href="/insights"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Insights
        </Link>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-x-4 text-sm mb-6">
          <time dateTime={post.published_at || ""} className="text-muted-foreground">
            {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
          </time>
          <span className="relative z-10 rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
            Blog
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
          {post.title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
