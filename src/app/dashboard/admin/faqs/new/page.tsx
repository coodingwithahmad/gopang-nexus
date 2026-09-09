import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaqForm } from "@/components/forms/FaqForm";

export default function NewFaqPage() {
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
        <h1 className="text-2xl font-bold text-foreground">Add New FAQ</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create a new frequently asked question.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <FaqForm />
      </div>
    </div>
  );
}
