"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPortfolioProjectAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);
  const image_path = formData.get("image_path") as string;
  const published = formData.get("published") === "true" || formData.get("published") === "on";
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;

  const { error } = await (supabase as any).from("portfolio_projects").insert({
    title,
    slug,
    summary,
    description,
    tags,
    image_path: image_path || null,
    published,
    sort_order,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin/projects");
}

export async function updatePortfolioProjectAction(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);
  const image_path = formData.get("image_path") as string;
  const published = formData.get("published") === "true" || formData.get("published") === "on";
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;

  const { error } = await (supabase as any).from("portfolio_projects").update({
    title,
    slug,
    summary,
    description,
    tags,
    image_path: image_path || null,
    published,
    sort_order,
  }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/projects");
  redirect("/dashboard/admin/projects");
}

export async function deletePortfolioProjectAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  const { error } = await (supabase as any).from("portfolio_projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/projects");
}
