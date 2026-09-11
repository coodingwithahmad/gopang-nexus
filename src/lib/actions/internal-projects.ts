"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProjectStatus = Database["public"]["Tables"]["projects"]["Row"]["status"];
type ProjectUpdatePayload = Database["public"]["Tables"]["projects"]["Update"] & {
  client_id?: string;
};

export async function createInternalProjectAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const client_id = formData.get("client_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as ProjectStatus;
  const start_date = formData.get("start_date") as string || null;
  const due_date = formData.get("due_date") as string || null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("projects").insert({
    client_id,
    title,
    description,
    status,
    start_date,
    due_date,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/internal-projects");
  redirect("/dashboard/admin/internal-projects");
}

export async function updateInternalProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const client_id = formData.get("client_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as ProjectStatus;
  const start_date = formData.get("start_date") as string || null;
  const due_date = formData.get("due_date") as string || null;

  // Handle completed_at logic
  let completed_at = undefined;
  if (status === "completed") {
    const { data: curr } = await supabase.from("projects").select("status, completed_at").eq("id", id).single();
    if (curr?.status !== "completed") {
      completed_at = new Date().toISOString();
    }
  } else {
    completed_at = null; // reset if moved away from completed
  }

  const payload: ProjectUpdatePayload = {
    client_id,
    title,
    description,
    status,
    start_date,
    due_date,
  };

  if (completed_at !== undefined) {
    payload.completed_at = completed_at;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("projects").update(payload).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/internal-projects");
  redirect("/dashboard/admin/internal-projects");
}

export async function deleteInternalProjectAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/internal-projects");
  redirect("/dashboard/admin/internal-projects");
}
