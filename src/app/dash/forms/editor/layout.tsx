"use client";

import React, { useCallback } from "react";
import {
  FormEditorProvider,
  useFormEditor,
} from "../_components/FormEditorProvider";
import { MobileEditorHeader } from "../_components/editor/mobile/MobileEditorHeader";
import { EditorHeader } from "../_components/editor/EditorHeader";
import { FormTabs } from "../_components/editor/FormTabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const searchParams = useSearchParams();
  const formId = searchParams.get("id") || "";
  const { save, isLoading } = useFormEditor();
  const isMobile = useIsMobile();

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);
  const handleSave = useCallback(() => save("DRAFT"), [save]);
  const handlePreview = useCallback(() => {
    // Open preview in new tab if form is saved (has ID)
    if (formId) {
      window.open(`/f/${formId}`, "_blank");
    }
  }, [formId]);

  if (isMobile) {
    return (
      <>
        <MobileEditorHeader
          formId={formId}
          onPublish={handlePublish}
          onSave={handleSave}
          onPreview={handlePreview}
          isLoading={isLoading}
        />
        <FormTabs activeTab="editor" formId={formId} />
      </>
    );
  }

  return (
    <>
      {/* Top Header with Save/Publish buttons */}
      <EditorHeader
        onPublish={handlePublish}
        isLoading={isLoading}
        formId={formId}
        activeTab="editor"
      />

      {/* Shared Persistent Tabs Bar — Editor | Submissions */}
      <FormTabs activeTab="editor" formId={formId} />
    </>
  );
};
