import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFormById, getFormSubmissions } from "@/server/services/forms";
import { SubmissionsList } from "../../_components/SubmissionsList";
import { workspaceService } from "@/server/workspace/service";
import type { FormField } from "@dm-broo/common-types";
import type { FormSubmission } from "@/types/form";

type SubmissionsPageProps = {
  params: Promise<{ id: string }>;
};

// Server page — fetches form + its submissions, renders the table
export default async function SubmissionsPage({
  params,
}: SubmissionsPageProps) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  let workspace;
  try {
    workspace = await workspaceService.getVerifiedActiveWorkspace();
  } catch (error: any) {
    const { isRedirectError } =
      await import("next/dist/client/components/redirect-error");
    // Explicitly re-throw Next.js redirect errors so they aren't swallowed by catch
    if (isRedirectError(error)) throw error;

    console.error("[SubmissionsPage] Failed to resolve workspace:", error);
    redirect("/auth/connect");
  }

  if (!workspace?.id) {
    redirect("/auth/connect");
  }

  const instaAccountId = workspace.id;

  const [form, submissions] = await Promise.all([
    getFormById(clerkId, instaAccountId, id).catch(() => null),
    getFormSubmissions(clerkId, instaAccountId, id).catch(() => []),
  ]);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Form not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Submissions List Component */}
      <SubmissionsList
        fields={form.fields as FormField[]}
        submissions={submissions as FormSubmission[]}
      />
    </div>
  );
}
