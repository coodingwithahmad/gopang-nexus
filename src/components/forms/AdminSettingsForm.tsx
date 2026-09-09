"use client";

import { useState } from "react";
import { updateSettingsAction } from "@/lib/actions/settings";
import { Loader2 } from "lucide-react";

export function SettingsForm({ initialData }: { initialData: Record<string, any> }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      await updateSettingsAction(formData);
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "An error occurred while saving." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {message && (
        <div className={`p-4 text-sm rounded-md border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {message.text}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="company_name" className="block text-sm font-medium text-foreground">Company Name</label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              defaultValue={initialData?.company_name || "GOPANG IT SOLUTION"}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contact_email" className="block text-sm font-medium text-foreground">Contact Email</label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={initialData?.contact_email || "support@gopang.com"}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contact_phone" className="block text-sm font-medium text-foreground">Contact Phone</label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="text"
              defaultValue={initialData?.contact_phone || ""}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-lg font-medium text-foreground mb-4">Homepage Configuration</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="hero_title" className="block text-sm font-medium text-foreground">Hero Title</label>
            <input
              id="hero_title"
              name="hero_title"
              type="text"
              defaultValue={initialData?.hero_title || "Empowering Your Digital Transformation"}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="hero_subtitle" className="block text-sm font-medium text-foreground">Hero Subtitle</label>
            <textarea
              id="hero_subtitle"
              name="hero_subtitle"
              rows={2}
              defaultValue={initialData?.hero_subtitle || "We build cutting-edge solutions that drive business growth and user engagement."}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
