import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Admin access check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)]">
      <div className="border-b border-border bg-background px-4 sm:px-6 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-foreground text-sm tracking-wide uppercase">
          Admin Panel
        </h1>
        <Link
          href="/dashboard"
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
