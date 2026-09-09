import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/forms/AdminSettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("*");

  // Transform KV array into an object for the form
  const initialSettings = (settings || []).reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage the public website's core configuration and company information.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <SettingsForm initialData={initialSettings} />
      </div>
    </div>
  );
}
