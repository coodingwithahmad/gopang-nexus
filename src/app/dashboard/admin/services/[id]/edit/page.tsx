import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/forms/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Services
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Service</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update the details for <strong>{service.title}</strong>.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <ServiceForm initialData={service} />
      </div>
    </div>
  );
}
