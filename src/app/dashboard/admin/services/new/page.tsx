import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/forms/ServiceForm";

export default function NewServicePage() {
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
        <h1 className="text-2xl font-bold text-foreground">Add New Service</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create a new service offering for the public website.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
