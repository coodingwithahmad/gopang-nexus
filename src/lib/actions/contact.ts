"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  // Parse and validate — server-side, regardless of client validation
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    // Return the first validation error — client should have caught these,
    // but server validation is the authoritative check
    const firstError = result.error.errors[0]?.message ?? "Invalid form data.";
    return { status: "error", message: firstError };
  }

  const { name, email, company, subject, message } = result.data;

  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailFrom = process.env.CONTACT_EMAIL_FROM;

  if (!emailTo || !emailFrom) {
    return {
      status: "error",
      message: "Email is not configured. Please contact us directly.",
    };
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: `Contact: ${subject}`,
      text: [
        `From: ${name} <${email}>`,
        company ? `Company: ${company}` : "",
        "",
        subject,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return { status: "success" };
  } catch (err) {
    // Log the technical error server-side, return a safe message to the user
    console.error("[Contact form] Failed to send email:", err);
    return {
      status: "error",
      message:
        "We couldn't send your message. Please try again or email us directly.",
    };
  }
}
