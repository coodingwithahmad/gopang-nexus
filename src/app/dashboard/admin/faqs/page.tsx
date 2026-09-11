import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { deleteFaqAction } from "@/lib/actions/faqs";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";

type AdminFaq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number | null;
  is_active: boolean;
};

export default async function FaqsAdminPage() {
  const supabase = await createClient();

  const { data: faqsData } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  const faqs = (faqsData ?? []) as unknown as AdminFaq[];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage frequently asked questions.
          </p>
        </div>
        <Link
          href="/dashboard/admin/faqs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add FAQ
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Question</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!faqs || faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No FAQs found. Add your first FAQ to get started.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{faq.question}</div>
                      <div className="text-muted-foreground text-xs truncate max-w-sm mt-1">
                        {faq.answer}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{faq.sort_order}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                          faq.is_active
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {faq.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/faqs/${faq.id}/edit`}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={deleteFaqAction.bind(null, faq.id)}>
                          <ConfirmSubmitButton message="Are you sure you want to delete this FAQ?" />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
