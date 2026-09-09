"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Unauthorized" };

  const clientId = formData.get("clientId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from("projects").insert({
    client_id: clientId,
    name,
    description,
    status
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Unauthorized" };

  const projectId = formData.get("projectId") as string;

  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/projects");
}
