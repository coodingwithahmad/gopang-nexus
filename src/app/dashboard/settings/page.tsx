import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/forms/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company, phone, email")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-8">Account Settings</h1>
      <SettingsForm profile={profile} />
    </div>
  );
}
