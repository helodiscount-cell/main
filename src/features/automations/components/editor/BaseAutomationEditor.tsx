"use client";

import React from "react";
import { z } from "zod";
import {
  FieldValues,
  UseFormReturn,
  DefaultValues,
  FormProvider,
} from "react-hook-form";
import { useAutomationManager } from "@/hooks/use-automations";
import { AutomationLayout } from "./AutomationLayout";
import { Spinner } from "@/components/ui/spinner";
import { FreshHeader, LiveHeader } from "../headers";
import { AutomationListItem } from "@/api/services/automations/types";

// Extends the standard form return with the media-uploading state setter
export interface RightColForm<
  TFormValues extends FieldValues,
> extends UseFormReturn<TFormValues> {
  setIsMediaUploading: (v: boolean) => void;
}

interface BaseAutomationEditorProps<TFormValues extends FieldValues> {
  schema: z.ZodType<TFormValues>;
  defaultValues: DefaultValues<TFormValues>;
  automationId?: string;
  onBuildPayload: (data: TFormValues) => Record<string, unknown> | null;
  onPopulateForm?: (
    automation: AutomationListItem,
  ) => DefaultValues<TFormValues>;
  onPayloadInvalid?: () => void;
  successMessage: string;
  stopMessage: string;
  onCreateSuccess?: (result: { id: string; triggerType: string }) => void;

  // Layout specifics
  triggerType?: string;
  breadcrumb?: string;
  post?: { mediaUrl: string | null; mediaType: string | null } | null;

  // Column render props
  renderLeftCol: (form: UseFormReturn<TFormValues>) => React.ReactNode;
  renderRightCol: (form: RightColForm<TFormValues>) => React.ReactNode;
}

/**
 * Unified skeleton for all automation editor pages.
 * Handles create vs edit mode, loading/not-found states, and the shared layout.
 */
export function BaseAutomationEditor<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  automationId,
  onBuildPayload,
  onPopulateForm,
  onPayloadInvalid,
  successMessage,
  stopMessage,
  onCreateSuccess,
  triggerType,
  breadcrumb,
  post,
  renderLeftCol,
  renderRightCol,
}: BaseAutomationEditorProps<TFormValues>) {
  const {
    form,
    existingAutomation,
    pageState,
    isCreating,
    isUpdating,
    isStopping,
    isStarting,
    isMediaUploading,
    setIsMediaUploading,
    stopAutomation,
    startAutomation,
    handleSubmit,
    handleNameChange,
  } = useAutomationManager<TFormValues>({
    schema,
    defaultValues,
    automationId,
    onBuildPayload,
    onPopulateForm,
    onPayloadInvalid,
    successMessage,
    stopMessage,
    onCreateSuccess,
  });

  // Watch name separately to avoid re-rendering the whole form on every keystroke
  const automationName = form.watch("automationName" as any) as string;

  if (pageState === "loading") {
    return (
      <div className="flex items-center justify-center h-full bg-[#09090B]">
        <Spinner className="text-[#6A06E4] size-6" strokeWidth={2.5} />
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p className="text-lg">Automation not found</p>
      </div>
    );
  }

  const header =
    pageState === "live" ? (
      <LiveHeader
        automation={existingAutomation!}
        onStop={stopAutomation}
        isStopping={isStopping}
        onStart={startAutomation}
        isStarting={isStarting}
        isUpdating={isUpdating}
        isMediaUploading={isMediaUploading}
        onNameChange={handleNameChange}
        breadcrumb={breadcrumb}
      />
    ) : (
      <FreshHeader
        isPending={isCreating}
        isMediaUploading={isMediaUploading}
        automationName={automationName ?? ""}
        onNameChange={handleNameChange}
        breadcrumb={breadcrumb}
      />
    );

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col h-full overflow-hidden gap-4"
      >
        <AutomationLayout
          header={header}
          triggerType={triggerType}
          post={post}
          leftCol={renderLeftCol(form)}
          rightCol={renderRightCol({ ...form, setIsMediaUploading })}
        />
      </form>
    </FormProvider>
  );
}
