"use client";

import { use } from "react";
import { useController, useFormContext } from "react-hook-form";
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
import {
  BaseAutomationEditor,
  RightColForm,
} from "@/features/automations/components/editor/BaseAutomationEditor";
import { AutomationRightCol } from "@/features/automations/components/editor/AutomationRightCol";
import { AddKeywords } from "@/features/automations/components/widgets";
import { Spinner } from "@/components/ui/spinner";
import { AutomationListItem } from "@/api/services/automations/types";

// Left column for comment/story/DM automations — shared keywords widget
function KeywordsLeftCol({
  control,
}: {
  control: ReturnType<typeof useFormContext>["control"];
}) {
  const { field: anyField } = useController({ control, name: "anyKeyword" });
  const { field: keywordsField } = useController({ control, name: "keywords" });
  return (
    <AddKeywords
      anyKeyword={anyField.value}
      onAnyKeywordChange={anyField.onChange}
      keywords={keywordsField.value}
      onKeywordsChange={keywordsField.onChange}
    />
  );
}

// Derive the correct editor config from the automation's triggerType
function resolveEditorConfig(automation: AutomationListItem) {
  switch (automation.triggerType) {
    case "COMMENT_ON_POST":
      return {
        schema: commentsAutomationSchema,
        defaultValues: COMMENTS_DEFAULT_VALUES,
        config: AUTOMATION_CONFIGS.COMMENT_REPLY,
        includePublicReply: true,
        onPopulateForm: populateCommentsForm,
        post: automation.post
          ? {
              mediaUrl: automation.post.mediaUrl,
              mediaType: automation.post.mediaType,
            }
          : null,
      };
    case "STORY_REPLY":
      return {
        schema: storyAutomationSchema,
        defaultValues: STORY_DEFAULT_VALUES,
        config: AUTOMATION_CONFIGS.STORY_REPLY,
        includePublicReply: false,
        onPopulateForm: populateBaseForm,
        post: automation.story
          ? {
              mediaUrl: automation.story.mediaUrl,
              mediaType: automation.story.mediaType,
            }
          : null,
      };
    case "RESPOND_TO_ALL_DMS":
      return {
        schema: respondToAllDmsSchema,
        defaultValues: DMS_DEFAULT_VALUES,
        config: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS,
        includePublicReply: false,
        onPopulateForm: populateBaseForm,
        post: null,
      };
    default:
      return null;
  }
}

// Build the PATCH payload — same structure across all edit types
function buildEditPayload(
  form: CommentsFormValues | StoryFormValues | RespondToAllDMsFormValues,
) {
  const base = {
    automationName: form.automationName,
    anyKeyword: form.anyKeyword,
    triggers: form.keywords,
    replyMessage: form.dmMessage,
    replyImage: form.dmImage || null,
    dmLinks: form.dmLinks || [],
    useVariables: true,
    askToFollowEnabled: form.askToFollowEnabled,
    askToFollowMessage: form.askToFollowMessage || null,
    askToFollowLink: form.askToFollowLink || null,
    openingMessageEnabled: form.openingMessageEnabled,
    openingMessage: form.openingMessage || null,
    openingButtonText: form.openingButtonText || null,
  };

  // Include public reply fields only if present on form
  if ("publicReplies" in form) {
    return {
      ...base,
      commentReplyWhenDm:
        form.publicReplyEnabled && form.publicReplies.length > 0
          ? form.publicReplies.map((r) => r.text)
          : [],
    };
  }
  return { ...base, commentReplyWhenDm: [] };
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  // Pre-fetch so resolveEditorConfig can determine which schema to use
  const { data, isLoading } = useQuery({
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

  const automation = data?.automation;
  if (!automation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p className="text-lg">Automation not found</p>
      </div>
    );
  }

  const editorConfig = resolveEditorConfig(automation);
  if (!editorConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p className="text-lg">Unknown automation type</p>
      </div>
    );
  }

  const {
    schema,
    defaultValues,
    config,
    includePublicReply,
    onPopulateForm,
    post,
  } = editorConfig;

  return (
    <BaseAutomationEditor<
      CommentsFormValues | StoryFormValues | RespondToAllDMsFormValues
    >
      automationId={id}
      schema={schema as never}
      defaultValues={defaultValues as never}
      triggerType={config.triggerType}
      breadcrumb={config.breadcrumb}
      successMessage={UPDATE_SUCCESS_MESSAGE}
      stopMessage={config.stopMessage}
      post={post}
      onBuildPayload={(form) => buildEditPayload(form as CommentsFormValues)}
      onPopulateForm={onPopulateForm as never}
      renderLeftCol={(form) => (
        <KeywordsLeftCol control={form.control as never} />
      )}
      renderRightCol={(
        form: RightColForm<
          CommentsFormValues | StoryFormValues | RespondToAllDMsFormValues
        >,
      ) => (
        <AutomationRightCol
          control={form.control as never}
          includePublicReply={includePublicReply}
          onIsUploadingChange={form.setIsMediaUploading}
        />
      )}
    />
  );
};

export default Page;
