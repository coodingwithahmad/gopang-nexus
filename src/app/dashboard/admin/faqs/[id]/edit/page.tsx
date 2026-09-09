import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaqForm } from "@/components/forms/FaqForm";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: faq } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single();

  if (!faq) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard/admin/faqs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to FAQs
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit FAQ</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update the question and answer.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <FaqForm initialData={faq} />
      </div>
    </div>
  );
}
