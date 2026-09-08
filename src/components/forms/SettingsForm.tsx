"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, passwordChangeSchema, type ProfileFormData, type PasswordChangeData } from "@/lib/validations/schemas";
import { updateProfileAction, changePasswordAction, type ProfileActionState } from "@/lib/actions/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

interface Profile {
  full_name: string | null;
  company: string | null;
  phone: string | null;
  email: string;
}

const idle: ProfileActionState = { status: "idle" };

function StatusMessage({ state }: { state: ProfileActionState }) {
  if (state.status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
        <CheckCircle size={14} />
        {state.message}
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
        {state.message}
      </p>
    );
  }
  return null;
}

export function SettingsForm({ profile }: { profile: Profile }) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    idle
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    idle
  );

  const {
    register: registerProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name ?? "",
      company: profile.company ?? "",
      phone: profile.phone ?? "",
    },
  });

  const {
    register: registerPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  return (
    <div className="space-y-10">
      {/* Profile section */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Update your contact information.
        </p>

        <form action={profileAction} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact us if you need to update it.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="full_name">
              Full name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              type="text"
              autoComplete="name"
              aria-invalid={!!profileErrors.full_name}
              {...registerProfile("full_name")}
            />
            {profileErrors.full_name && (
              <p className="text-sm text-destructive">{profileErrors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              type="text"
              autoComplete="organization"
              {...registerProfile("company")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...registerProfile("phone")}
            />
          </div>

          <StatusMessage state={profileState} />

          <button
            type="submit"
            disabled={profilePending}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {profilePending ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      <div className="border-t border-border" />

      {/* Password section */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-1">
          Change Password
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Use a password that is at least 8 characters with uppercase, lowercase,
          and a number.
        </p>

        <form action={passwordAction} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!passwordErrors.currentPassword}
              {...registerPassword("currentPassword")}
            />
            {passwordErrors.currentPassword && (
              <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!passwordErrors.newPassword}
              {...registerPassword("newPassword")}
            />
            {passwordErrors.newPassword && (
              <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!passwordErrors.confirmPassword}
              {...registerPassword("confirmPassword")}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>

          <StatusMessage state={passwordState} />

          <button
            type="submit"
            disabled={passwordPending}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {passwordPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}
