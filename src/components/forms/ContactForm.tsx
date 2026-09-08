"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations/schemas";
import { submitContact, type ContactActionState } from "@/lib/actions/contact";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

const initialState: ContactActionState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState
  );

  const {
    register,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 p-5 rounded-lg bg-green-50 border border-green-200 text-green-900">
        <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Message sent.</p>
          <p className="text-sm mt-1 text-green-800">
            We&apos;ve received your message and will respond within one
            business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          type="text"
          autoComplete="organization"
          placeholder="Optional"
          {...register("company")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">
          Subject <span className="text-destructive">*</span>
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="What can we help with?"
          aria-describedby={errors.subject ? "subject-error" : undefined}
          aria-invalid={!!errors.subject}
          {...register("subject")}
        />
        {errors.subject && (
          <p id="subject-error" className="text-sm text-destructive">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Describe your project or question..."
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
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
        {isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
