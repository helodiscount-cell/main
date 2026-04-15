"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BaseFormLayout } from "../_components/editor";

/**
 * Higher-order component to extract formId from search params.
 */
function EditorLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id") || undefined;

  return <BaseFormLayout formId={formId}>{children}</BaseFormLayout>;
}

export default function FormEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <EditorLayoutContent>{children}</EditorLayoutContent>
    </Suspense>
  );
}
