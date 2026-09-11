import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/forms/AdminSettingsForm";

type SettingRow = {
  key: string;
  value: string | null;
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settingsData } = await supabase
    .from("settings")
    .select("*");
  const settings = (settingsData ?? []) as unknown as SettingRow[];

  // Transform KV array into an object for the form
  const initialSettings = settings.reduce<Record<string, string | null>>((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage the public website&apos;s core configuration and company information.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <SettingsForm initialData={initialSettings} />
      </div>
    </div>
  );
}
