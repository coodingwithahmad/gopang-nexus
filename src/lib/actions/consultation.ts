"use server";

import { Resend } from "resend";
import { consultationSchema } from "@/lib/validations/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const projectTypeLabels: Record<string, string> = {
  "web-development": "Website or web application",
  "business-application": "Business / internal application",
  "it-consulting": "IT consulting or planning",
  "maintenance": "Ongoing maintenance or support",
  "other": "Something else",
};

const budgetLabels: Record<string, string> = {
  "under-5k": "Under $5,000",
  "5k-15k": "$5,000 – $15,000",
  "15k-50k": "$15,000 – $50,000",
  "50k-plus": "$50,000+",
  "not-sure": "Not sure yet",
};

export async function submitConsultation(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    phone: formData.get("phone") || undefined,
    projectType: formData.get("projectType"),
    description: formData.get("description"),
    budget: formData.get("budget") || undefined,
  };

  const result = consultationSchema.safeParse(raw);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.errors[0]?.message ?? "Invalid form data.",
    };
  }

  const { name, email, company, phone, projectType, description, budget } =
    result.data;

  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailFrom = process.env.CONTACT_EMAIL_FROM;

  if (!emailTo || !emailFrom) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Consultation] Email not configured — submission logged only");
      return { status: "success" };
    }
    return {
      status: "error",
      message: "Email is not configured. Please contact us directly.",
    };
  }

  const body = [
    `Consultation request from: ${name} <${email}>`,
    company ? `Company: ${company}` : "",
    phone ? `Phone: ${phone}` : "",
    "",
    `Project type: ${projectTypeLabels[projectType] ?? projectType}`,
    budget ? `Budget: ${budgetLabels[budget] ?? budget}` : "",
    "",
    "Project description:",
    description,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: `Consultation request: ${name}`,
      text: body,
    });

    return { status: "success" };
  } catch (err) {
    console.error("[Consultation] Failed to send email:", err);
    return {
      status: "error",
      message: "We couldn't send your request. Please try again or email us directly.",
    };
  }
}
