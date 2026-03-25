"use client";

import React, { useCallback } from "react";
import {
  FormEditorProvider,
  useFormEditor,
} from "../_components/FormEditorProvider";
import { EditorHeader } from "../_components/editor/EditorHeader";
import { FormTabs } from "../_components/editor/FormTabs";

export default function FormEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormEditorProvider>
      <div className="flex flex-col h-full min-h-screen">
        <EditorLayoutHeader />

        {/* Child components (the page canvas) */}
        <div className="flex-1 overflow-hidden">{children}</div>
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

  const handleSaveDraft = useCallback(() => save("DRAFT"), [save]);
  const handlePublish = useCallback(() => save("PUBLISHED"), [save]);

  return (
    <>
      {/* Top Header with Save/Publish buttons */}
      <EditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isLoading={isLoading}
      />

      {/* Shared Persistent Tabs Bar — Editor | Submissions */}
      <FormTabs activeTab="editor" />
    </>
  );
};
