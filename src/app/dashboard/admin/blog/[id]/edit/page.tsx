import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/forms/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update the content for <strong>{post.title}</strong>.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <BlogForm initialData={post} />
      </div>
    </div>
  );
}
