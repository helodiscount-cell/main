"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { automationService } from "@/api/services/automations";
import { automationKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  COMMENTS_DEFAULT_VALUES,
  STORY_DEFAULT_VALUES,
  DMS_DEFAULT_VALUES,
  populateBaseForm,
  populateCommentsForm,
  CommentsFormValues,
  StoryFormValues,
  RespondToAllDMsFormValues,
  commentsAutomationSchema,
  storyAutomationSchema,
  respondToAllDmsSchema,
  UPDATE_SUCCESS_MESSAGE,
} from "@/configs/automations.config";
import { BaseAutomationEditor } from "@/features/automations/components/editor/BaseAutomationEditor";
import { AutomationRightCol } from "@/features/automations/components/editor/AutomationRightCol";
import { AddKeywords } from "@/features/automations/components/widgets";
import { KeywordsLeftCol } from "@/features/automations/components/editor/KeywordsLeftCol";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AutomationListItem } from "@/api/services/automations/types";

import { buildAutomationPayload } from "@/features/automations/utils/automation-payload";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  // Fetch automation details to resolve schema and populate editor
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: automationKeys.detail(id),
    queryFn: () => automationService.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#09090B]">
        <Spinner className="text-[#6A06E4] size-6" strokeWidth={2.5} />
      </div>
    );
  }

  // Handle fetch errors separately from missing data
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
        <div className="text-center space-y-1">
          <p className="text-lg">Failed to load automation</p>
          <p className="text-sm text-zinc-600">
            {(error as Error)?.message || "Internal server error"}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="border-zinc-800 hover:bg-zinc-900"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const automation = data?.automation;
  if (!automation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p className="text-lg">Automation not found</p>
      </div>
    );
  }

  if (automation.triggerType === "COMMENT_ON_POST") {
    return (
      <BaseAutomationEditor<CommentsFormValues>
        automationId={id}
        schema={commentsAutomationSchema}
        defaultValues={COMMENTS_DEFAULT_VALUES}
        triggerType={AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType}
        breadcrumb={AUTOMATION_CONFIGS.COMMENT_REPLY.breadcrumb}
        successMessage={UPDATE_SUCCESS_MESSAGE}
        stopMessage={AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage}
        post={
          automation.post
            ? {
                mediaUrl: automation.post.mediaUrl,
                mediaType: automation.post.mediaType,
              }
            : null
        }
        onBuildPayload={buildAutomationPayload}
        onPopulateForm={populateCommentsForm}
        renderLeftCol={(form) => <KeywordsLeftCol control={form.control} />}
        renderRightCol={(form) => (
          <AutomationRightCol
            control={form.control}
            includePublicReply
            onIsUploadingChange={form.setIsMediaUploading}
          />
        )}
      />
    );
  }

  if (automation.triggerType === "STORY_REPLY") {
    return (
      <BaseAutomationEditor<StoryFormValues>
        automationId={id}
        schema={storyAutomationSchema}
        defaultValues={STORY_DEFAULT_VALUES}
        triggerType={AUTOMATION_CONFIGS.STORY_REPLY.triggerType}
        breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
        successMessage={UPDATE_SUCCESS_MESSAGE}
        stopMessage={AUTOMATION_CONFIGS.STORY_REPLY.stopMessage}
        post={
          automation.story
            ? {
                mediaUrl: automation.story.mediaUrl,
                mediaType: automation.story.mediaType,
              }
            : null
        }
        onBuildPayload={buildAutomationPayload}
        onPopulateForm={populateBaseForm}
        renderLeftCol={(form) => <KeywordsLeftCol control={form.control} />}
        renderRightCol={(form) => (
          <AutomationRightCol
            control={form.control}
            onIsUploadingChange={form.setIsMediaUploading}
          />
        )}
      />
    );
  }

  if (automation.triggerType === "RESPOND_TO_ALL_DMS") {
    return (
      <BaseAutomationEditor<RespondToAllDMsFormValues>
        automationId={id}
        schema={respondToAllDmsSchema}
        defaultValues={DMS_DEFAULT_VALUES}
        triggerType={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.triggerType}
        breadcrumb={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.breadcrumb}
        successMessage={UPDATE_SUCCESS_MESSAGE}
        stopMessage={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.stopMessage}
        post={null}
        onBuildPayload={buildAutomationPayload}
        onPopulateForm={populateBaseForm}
        renderLeftCol={(form) => <KeywordsLeftCol control={form.control} />}
        renderRightCol={(form) => (
          <AutomationRightCol
            control={form.control}
            onIsUploadingChange={form.setIsMediaUploading}
          />
        )}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
      <p className="text-lg">Unknown automation type</p>
    </div>
  );
};

export default Page;
