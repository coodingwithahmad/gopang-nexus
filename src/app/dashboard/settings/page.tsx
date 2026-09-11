import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/forms/SettingsForm";

export const metadata: Metadata = {
  title: "Account Settings",
  robots: { index: false },
};

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, company, phone")
    .eq("id", user.id)
    .single();

  const safeProfile = {
    full_name: profile?.full_name ?? user.email?.split("@")[0] ?? "",
    email: profile?.email ?? user.email ?? "",
    company: profile?.company ?? null,
    phone: profile?.phone ?? null,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your profile details and change your password.
        </p>
      </div>

      <div className="bg-background rounded-lg border border-border shadow-sm p-6">
        <SettingsForm profile={safeProfile} />
      </div>
    </div>
  );
}
