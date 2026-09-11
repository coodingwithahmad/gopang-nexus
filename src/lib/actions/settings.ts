"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettingsAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const updates = [
    { key: "company_name", value: formData.get("company_name"), description: "Official company name" },
    { key: "contact_email", value: formData.get("contact_email"), description: "Public contact email" },
    { key: "contact_phone", value: formData.get("contact_phone"), description: "Public contact phone" },
    { key: "hero_title", value: formData.get("hero_title"), description: "Homepage Hero Title" },
    { key: "hero_subtitle", value: formData.get("hero_subtitle"), description: "Homepage Hero Subtitle" },
  ];

  for (const item of updates) {
    if (item.value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("settings")
        .upsert(
          { key: item.key, value: item.value, description: item.description },
          { onConflict: "key" }
        );
      
      if (error) {
        console.error("Setting update error:", error);
      }
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard/admin/settings");
}
