"use client";

import { useActionState, useRef, useEffect } from "react";
import { replyToTicketAction, type TicketActionState } from "@/lib/actions/tickets";
import { Textarea } from "@/components/ui/textarea";

const initialState: TicketActionState = { status: "idle" };

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = replyToTicketAction.bind(null, ticketId);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  // Clear the form on successful reply
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3" noValidate>
      <Textarea
        name="content"
        rows={3}
        placeholder="Write a reply..."
        required
        minLength={1}
        maxLength={5000}
        aria-label="Reply message"
      />

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Sending..." : "Send reply"}
        </button>
      </div>
    </form>
  );
}
