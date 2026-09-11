"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createServiceAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const icon_name = formData.get("icon_name") as string;
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
  const published = formData.get("published") === "true" || formData.get("published") === "on";

  // Auto-generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const { error } = await supabase.from("services").insert({
    title,
    slug,
    summary,
    description,
    icon_name: icon_name || "Code", // Default icon
    sort_order,
    published,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/admin/services");
  revalidatePath("/services");
}

export async function updateServiceAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const icon_name = formData.get("icon_name") as string;
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
  const published = formData.get("published") === "true" || formData.get("published") === "on";

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("services")
    .update({
      title,
      slug,
      summary,
      description,
      icon_name: icon_name || "Code",
      sort_order,
      published,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/admin/services");
  revalidatePath("/services");
}

export async function deleteServiceAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/admin/services");
  revalidatePath("/services");
  redirect("/dashboard/admin/services");
}
