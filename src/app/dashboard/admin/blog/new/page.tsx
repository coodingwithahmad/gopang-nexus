import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/forms/BlogForm";

export default function NewBlogPage() {
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
        <h1 className="text-2xl font-bold text-foreground">Write New Post</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create a new article for the insights section.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <BlogForm />
      </div>
    </div>
  );
}
