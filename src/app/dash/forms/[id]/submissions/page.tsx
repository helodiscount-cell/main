import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFormById, getFormSubmissions } from "@/server/services/forms";
import { workspaceService } from "@/server/workspace/service";
import type { FormField } from "@dm-broo/common-types";
import type { FormSubmission } from "@/api/services/forms/form";
import { SubmissionsList } from "../../_components/SubmissionsList";

type SubmissionsPageProps = {
  params: Promise<{ id: string }>;
};

// Server page — fetches form + its submissions, renders the table
export default async function SubmissionsPage({
  params,
}: SubmissionsPageProps) {
  const { id } = await params;
  const { clerkId, instaAccountId } =
    await workspaceService.getVerifiedContext();

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
