import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Secure file download route.
 *
 * Checks:
 * 1. User is authenticated
 * 2. File exists and belongs to one of the user's projects (RLS enforced by DB)
 * 3. Creates a short-lived signed URL from private Supabase Storage
 *
 * Never exposes storage paths or allows unauthenticated access.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // RLS ensures this only returns files in projects belonging to the current user
  const { data: file } = await supabase
    .from("project_files")
    .select("storage_path, filename, mime_type")
    .eq("id", id)
    .single();

  if (!file) {
    return new NextResponse("File not found.", { status: 404 });
  }

  // Create a short-lived signed URL (5 minutes)
  const { data: signed, error } = await supabase.storage
    .from("project-files")
    .createSignedUrl(file.storage_path, 300);

  if (error || !signed?.signedUrl) {
    console.error("[File download] Failed to create signed URL:", error);
    return new NextResponse("Unable to generate download link.", { status: 500 });
  }

  // Redirect to the signed URL — browser handles the actual download
  return NextResponse.redirect(signed.signedUrl);
}
