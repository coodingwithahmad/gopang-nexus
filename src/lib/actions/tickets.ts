"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ticketSchema, ticketReplySchema } from "@/lib/validations/schemas";

export type TicketActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function createTicketAction(
  _prev: TicketActionState,
  formData: FormData
): Promise<TicketActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "You must be signed in." };
  }

  const raw = {
    subject: formData.get("subject"),
    projectId: formData.get("projectId") || undefined,
    priority: formData.get("priority") ?? "normal",
    message: formData.get("message"),
  };

  const result = ticketSchema.safeParse(raw);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.errors[0]?.message ?? "Invalid form data.",
    };
  }

  const { subject, priority, message, projectId } = result.data;

  // If a project ID was provided, verify it belongs to this user before associating
  if (projectId) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("client_id", user.id)
      .single();

    if (!project) {
      return { status: "error", message: "Invalid project selection." };
    }
  }

  // Create ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      client_id: user.id,
      project_id: projectId ?? null,
      subject,
      priority,
      status: "open",
    })
    .select("id")
    .single();

  if (ticketError || !ticket) {
    console.error("[Ticket] Insert error:", ticketError);
    return {
      status: "error",
      message: "We couldn't create your ticket. Please try again.",
    };
  }

  // Insert the first message
  const { error: msgError } = await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author_id: user.id,
    content: message,
    is_internal: false,
  });

  if (msgError) {
    console.error("[Ticket] Message insert error:", msgError);
  }

  revalidatePath("/dashboard/chats");
  redirect(`/dashboard/chats/${ticket.id}`);
}

export async function replyToTicketAction(
  ticketId: string,
  _prev: TicketActionState,
  formData: FormData
): Promise<TicketActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "You must be signed in." };
  }

  // Verify the ticket belongs to this user
  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, status")
    .eq("id", ticketId)
    .eq("client_id", user.id)
    .single();

  if (!ticket) {
    return { status: "error", message: "Ticket not found." };
  }

  if (ticket.status === "closed") {
    return { status: "error", message: "This ticket is closed." };
  }

  const raw = { content: formData.get("content") };
  const result = ticketReplySchema.safeParse(raw);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.errors[0]?.message ?? "Invalid message.",
    };
  }

  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    author_id: user.id,
    content: result.data.content,
    is_internal: false,
  });

  if (error) {
    console.error("[Ticket reply] Insert error:", error);
    return {
      status: "error",
      message: "We couldn't send your reply. Please try again.",
    };
  }

  revalidatePath(`/dashboard/chats/${ticketId}`);
  return { status: "success" };
}

export async function quickDiscussionAction(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const message = formData.get("message") as string;
  if (!message || message.trim() === "") return;

  // Create ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      client_id: user.id,
      project_id: null,
      subject: "Quick Discussion",
      priority: "normal",
      status: "open",
    })
    .select("id")
    .single();

  if (ticketError || !ticket) return;

  // Insert the message
  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author_id: user.id,
    content: message,
    is_internal: false,
  });

  revalidatePath("/dashboard/chats");
  redirect(`/dashboard/chats/${ticket.id}`);
}
