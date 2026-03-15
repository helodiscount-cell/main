import React from "react";
import { getPublicFormBySlug } from "@/server/services/forms";
import { PublicFormView } from "./_components/PublicFormView";
import type { FormPublic } from "@/types/form";

type PublicFormPageProps = {
  params: Promise<{ slug: string }>;
};

// Server component — fetches form data and renders the public fill page
export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { slug } = await params;
  const form = await getPublicFormBySlug(slug).catch(() => null);

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">404</h1>
          <p className="text-slate-500">
            This form doesn&apos;t exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Cover image if present */}
        {form.coverImage && (
          <img
            src={form.coverImage}
            alt="Form cover"
            className="w-full h-48 object-cover rounded-2xl"
          />
        )}

        {/* Form header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
          {form.description && (
            <p className="text-sm text-slate-500">{form.description}</p>
          )}
        </div>

        {/* Interactive form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <PublicFormView form={form as unknown as FormPublic} slug={slug} />
        </div>
      </div>
    </div>
  );
}
