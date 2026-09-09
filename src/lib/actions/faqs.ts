"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createFaqAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const category = formData.get("category") as string;
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";

  const { error } = await (supabase as any).from("faqs").insert({
    question,
    answer,
    category: category || "General",
    sort_order,
    is_active,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/faqs");
  revalidatePath("/faq");
  redirect("/dashboard/admin/faqs");
}

export async function updateFaqAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const category = formData.get("category") as string;
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";

  const { error } = await (supabase as any)
    .from("faqs")
    .update({
      question,
      answer,
      category: category || "General",
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/faqs");
  revalidatePath("/faq");
  redirect("/dashboard/admin/faqs");
}

export async function deleteFaqAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const { error } = await (supabase as any).from("faqs").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/faqs");
  revalidatePath("/faq");
  redirect("/dashboard/admin/faqs");
}
