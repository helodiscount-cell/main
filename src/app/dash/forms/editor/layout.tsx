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

import { usePathname, useSearchParams } from "next/navigation";

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
        <EditorLayoutHeader formId={formId} />

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
const EditorLayoutHeader = ({ formId }: { formId?: string }) => {
  const pathname = usePathname();
  const { save, isLoading } = useFormEditor();
  const isMobile = useIsMobile();

  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);
  const handleSave = useCallback(() => save("DRAFT"), [save]);

  if (isMobile) {
    return (
      <>
        <MobileEditorHeader
          formId={formId}
          onPublish={handlePublish}
          onSave={handleSave}
          isLoading={isLoading}
          activeTab="editor"
          onUpdate={handleSave}
          onUnpublish={handleSave}
        />
        <FormTabs activeTab="editor" formId={formId} />
      </>
    );
  }

  return (
    <>
      {/* Top Header with Save/Publish buttons */}
      <EditorHeader
        pathname={pathname}
        onPublish={handlePublish}
        onSaveDraft={handleSave}
        onUpdate={handleSave}
        isLoading={isLoading}
        formId={formId}
        activeTab="editor"
      />

      {/* Shared Persistent Tabs Bar — Editor | Submissions */}
      <FormTabs activeTab="editor" formId={formId} />
    </>
  );
};
