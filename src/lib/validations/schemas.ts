import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  company: z.string().max(100, "Company name is too long").optional(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be under 5,000 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const consultationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  company: z.string().max(100, "Company name is too long").optional(),
  phone: z.string().max(30, "Phone number is too long").optional(),
  projectType: z.enum(
    ["web-development", "business-application", "it-consulting", "maintenance", "other"],
    { message: "Please select a project type" }
  ),
  description: z
    .string()
    .min(30, "Please describe your project in at least 30 characters")
    .max(3000, "Description must be under 3,000 characters"),
  budget: z
    .enum(["under-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure"])
    .optional(),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;

export const ticketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  projectId: z.string().uuid("Invalid project").optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be under 5,000 characters"),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

export const ticketReplySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(5000, "Reply must be under 5,000 characters"),
});

export type TicketReplyData = z.infer<typeof ticketReplySchema>;

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  company: z.string().max(100, "Company name is too long").optional(),
  phone: z.string().max(30, "Phone number is too long").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;
