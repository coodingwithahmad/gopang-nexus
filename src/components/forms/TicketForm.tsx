"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, type TicketFormData } from "@/lib/validations/schemas";
import { createTicketAction, type TicketActionState } from "@/lib/actions/tickets";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  title: string;
}

interface NewTicketFormProps {
  projects: Project[];
}

const initialState: TicketActionState = { status: "idle" };

export function NewTicketForm({ projects }: NewTicketFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTicketAction,
    initialState
  );

  const {
    register,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="subject">
          Subject <span className="text-destructive">*</span>
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="Brief description of the issue"
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

      {projects.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="projectId">Related project (optional)</Label>
          <select
            id="projectId"
            name="projectId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Not related to a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="priority">Priority</Label>
        <select
          id="priority"
          {...register("priority")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          Describe the issue <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Please describe the issue in as much detail as possible..."
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
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Submitting..." : "Submit ticket"}
      </button>
    </form>
  );
}
