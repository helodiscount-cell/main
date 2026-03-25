import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFormById, getFormSubmissions } from "@/server/services/forms";
import { SubmissionsList } from "../../_components/SubmissionsList";
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

  const [form, submissions] = await Promise.all([
    getFormById(clerkId, id).catch(() => null),
    getFormSubmissions(clerkId, id).catch(() => []),
  ]);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Form not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Main Submissions List Component */}
      <SubmissionsList
        fields={form.fields as FormField[]}
        submissions={submissions as FormSubmission[]}
      />
    </div>
  );
}
