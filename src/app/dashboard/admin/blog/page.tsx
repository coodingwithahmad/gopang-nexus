import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { deleteBlogPostAction } from "@/lib/actions/blog";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";

type AdminBlogPost = {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  published: boolean;
  author?: {
    full_name: string | null;
  } | null;
};

export default async function BlogAdminPage() {
  const supabase = await createClient();

  const { data: postsData } = await supabase
    .from("blog_posts")
    .select("*, author:profiles!blog_posts_author_id_fkey(full_name)")
    .order("created_at", { ascending: false });
  const posts = (postsData ?? []) as unknown as AdminBlogPost[];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog & Insights</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your articles and industry insights.
          </p>
        </div>
        <Link
          href="/dashboard/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Write Post
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Post Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No posts found. Write your first article to get started.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{post.title}</div>
                      <div className="text-muted-foreground text-xs truncate max-w-sm mt-1">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4">{post.author?.full_name || "Unknown"}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDateTime(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                          post.published
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/blog/${post.id}/edit`}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={deleteBlogPostAction.bind(null, post.id)}>
                          <ConfirmSubmitButton message="Are you sure you want to delete this post?" />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
