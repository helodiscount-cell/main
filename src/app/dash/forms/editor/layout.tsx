"use client";

import React, { useCallback } from "react";
import {
  FormEditorProvider,
  useFormEditor,
} from "../_components/FormEditorProvider";
import { EditorHeader } from "../_components/editor/EditorHeader";
import { FormTabs } from "../_components/editor/FormTabs";

import { useSearchParams } from "next/navigation";

export default function FormEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id") || undefined;

  return (
    <FormEditorProvider formId={formId}>
      <div className="flex flex-col h-full min-h-screen">
        <EditorLayoutHeader />

        {/* Child components (the page canvas) */}
        {children}
      </div>
    </FormEditorProvider>
  );
}

/**
 * EditorLayoutHeader handles the header and tab bar visuals.
 * It connects to the FormEditorProvider to trigger saves across the layout and page.
 */
const EditorLayoutHeader = () => {
  const { save, isLoading } = useFormEditor();

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);

  return (
    <>
      {/* Top Header with Save/Publish buttons */}
      <EditorHeader onPublish={handlePublish} isLoading={isLoading} />

      {/* Shared Persistent Tabs Bar — Editor | Submissions */}
      <FormTabs activeTab="editor" />
    </>
  );
};
