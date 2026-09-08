"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, passwordChangeSchema } from "@/lib/validations/schemas";

export type ProfileActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "You must be signed in." };
  }

  const raw = {
    full_name: formData.get("full_name"),
    company: formData.get("company") || undefined,
    phone: formData.get("phone") || undefined,
  };

  const result = profileSchema.safeParse(raw);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.errors[0]?.message ?? "Invalid input.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: result.data.full_name,
      company: result.data.company ?? null,
      phone: result.data.phone ?? null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[Profile update] Error:", error);
    return {
      status: "error",
      message: "Failed to update profile. Please try again.",
    };
  }

  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Profile updated." };
}

export async function changePasswordAction(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "You must be signed in." };
  }

  const raw = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = passwordChangeSchema.safeParse(raw);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.errors[0]?.message ?? "Invalid input.",
    };
  }

  // Verify current password by attempting sign-in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: result.data.currentPassword,
  });

  if (verifyError) {
    return { status: "error", message: "Current password is incorrect." };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: result.data.newPassword,
  });

  if (updateError) {
    console.error("[Password change] Error:", updateError);
    return {
      status: "error",
      message: "Failed to update password. Please try again.",
    };
  }

  return { status: "success", message: "Password updated successfully." };
}
