"use client";

import React from "react";
import { FormEditorProvider } from "../../../../../providers/FormEditorProvider";
import { MobileEditorHeader } from "./mobile/MobileEditorHeader";
import { FormTabs } from "./FormTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { PatternedBackground } from "./mobile/PatternedBackground";
import EditorHeader from "./EditorHeader";

interface BaseFormLayoutProps {
  children: React.ReactNode;
  formId?: string;
}

/**
 * Shared layout component for form editor and detail views.
 * Handles mobile/desktop switching and common form actions.
 */
export default function BaseFormLayout({
  children,
  formId,
}: BaseFormLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Determine active tab based on URL path
  const activeTab = pathname.endsWith("/submissions")
    ? "submissions"
    : "editor";

  return (
    <FormEditorProvider formId={formId}>
      {isMobile ? (
        <MobileLayout formId={formId} activeTab={activeTab}>
          {children}
        </MobileLayout>
      ) : (
        <DesktopLayout
          formId={formId}
          activeTab={activeTab}
          pathname={pathname}
        >
          {children}
        </DesktopLayout>
      )}
    </FormEditorProvider>
  );
}

const MobileLayout = ({
  formId,
  activeTab,
  children,
}: {
  formId?: string;
  activeTab: "editor" | "submissions";
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4 bg-[#F3F4F6] min-h-screen">
      <MobileEditorHeader formId={formId} activeTab={activeTab} />
      <FormTabs formId={formId} activeTab={activeTab} />
      <PatternedBackground>
        <div className="p-4 flex-1">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {children}
          </div>
        </div>
      </PatternedBackground>
    </div>
  );
};

const DesktopLayout = ({
  formId,
  activeTab,
  pathname,
  children,
}: {
  formId?: string;
  activeTab: "editor" | "submissions";
  pathname: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-full min-h-screen gap-4">
      <EditorHeader activeTab={activeTab} />
      <FormTabs formId={formId} activeTab={activeTab} />
      <div
        className="flex-1 overflow-hidden"
        style={{
          backgroundColor: pathname.endsWith("/submissions")
            ? "white"
            : "#E0E0E0",
          borderRadius: "1.5rem",
          border: "1px solid #F1F5F9",
        }}
      >
        {children}
      </div>
    </div>
  );
};
