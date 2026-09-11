import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Server-side auth check — middleware is first defense, this is second
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile to get full_name and role
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url")
    .eq("id", user.id)
    .single();

  const safeProfile = profile || {
    id: user.id,
    full_name: user.email?.split("@")[0] || "Client",
    email: user.email || "no-email@example.com",
    role: "client" as const,
    avatar_url: null,
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <DashboardSidebar role={safeProfile.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader profile={safeProfile} />
        <main className="flex-1 px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
