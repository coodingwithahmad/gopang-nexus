"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBlogPostAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "true" || formData.get("published") === "on";
  
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const { error } = await (supabase as any).from("blog_posts").insert({
    title,
    slug,
    excerpt,
    content,
    author_id: user.id, // Assuming author is current admin
    published,
    published_at: published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/blog");
  revalidatePath("/insights");
  redirect("/dashboard/admin/blog");
}

export async function updateBlogPostAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "true" || formData.get("published") === "on";

  // Check current published state to manage published_at
  const { data: currentPost } = await supabase
    .from("blog_posts")
    .select("published, published_at")
    .eq("id", id)
    .single();

  let published_at = currentPost?.published_at;
  if (published && !currentPost?.published) {
    published_at = new Date().toISOString();
  } else if (!published) {
    published_at = null;
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const { error } = await (supabase as any)
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt,
      content,
      published,
      published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/blog");
  revalidatePath("/insights");
  redirect("/dashboard/admin/blog");
}

export async function deleteBlogPostAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await (supabase as any).from("blog_posts").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/blog");
  revalidatePath("/insights");
  redirect("/dashboard/admin/blog");
}
