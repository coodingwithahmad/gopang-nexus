"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema, type ConsultationFormData } from "@/lib/validations/schemas";
import { submitConsultation, type ContactActionState } from "@/lib/actions/consultation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

const initialState: ContactActionState = { status: "idle" };

export function ConsultationForm() {
  const [state, formAction, isPending] = useActionState(
    submitConsultation,
    initialState
  );

  const {
    register,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 p-5 rounded-lg bg-green-50 border border-green-200 text-green-900">
        <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Request received.</p>
          <p className="text-sm mt-1 text-green-800">
            We&apos;ll review your submission and get back to you within one
            business day to schedule a call.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
          <Input id="name" type="text" autoComplete="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" type="text" autoComplete="organization" {...register("company")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="projectType">Type of project <span className="text-destructive">*</span></Label>
        <select
          id="projectType"
          {...register("projectType")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select one</option>
          <option value="web-development">Website or web application</option>
          <option value="business-application">Business / internal application</option>
          <option value="it-consulting">IT consulting or planning</option>
          <option value="maintenance">Ongoing maintenance or support</option>
          <option value="other">Something else</option>
        </select>
        {errors.projectType && <p className="text-sm text-destructive">{errors.projectType.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Describe your project <span className="text-destructive">*</span></Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="What are you trying to build or solve? The more specific, the better."
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="budget">Approximate budget (optional)</Label>
        <select
          id="budget"
          {...register("budget")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Prefer not to say</option>
          <option value="under-5k">Under $5,000</option>
          <option value="5k-15k">$5,000 – $15,000</option>
          <option value="15k-50k">$15,000 – $50,000</option>
          <option value="50k-plus">$50,000+</option>
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Submitting..." : "Request consultation"}
      </button>
    </form>
  );
}
