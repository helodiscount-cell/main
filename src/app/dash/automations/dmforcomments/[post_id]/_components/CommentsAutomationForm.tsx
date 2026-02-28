"use client";

import { Controller } from "react-hook-form";
import { AutomationLayout } from "@/components/dash/automations/AutomationLayout";
import AddKeywords from "@/components/dash/automations/AddKeywords";
import PublicReplyToComments from "@/components/dash/automations/PublicReplyToComments";
import SendDm from "@/components/dash/automations/SendDm";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { FreshHeader } from "@/components/headers/FreshHeader";
import { LiveHeader } from "@/components/headers/LiveHeader";
import { useAutomationManager } from "@/hooks/use-automations";
import {
  AUTOMATION_CONFIGS,
  commentsAutomationSchema,
  CommentsFormValues,
} from "@/configs/automations";

type Reply = { id: string; text: string };

interface CommentsAutomationFormProps {
  post_id: string;
}

export function CommentsAutomationForm({
  post_id,
}: CommentsAutomationFormProps) {
  const {
    form: { control },
    existingAutomation,
    pageState,
    isCreating,
    isStopping,
    stopAutomation,
    isReRunning,
    handleReRun,
    handleSubmit,
  } = useAutomationManager<CommentsFormValues>({
    schema: commentsAutomationSchema,
    defaultValues: {
      keywords: [],
      dmMessage: "",
      publicReplyEnabled: true,
      publicReplies: [
        { id: crypto.randomUUID(), text: "Open your DMs, it's there!" },
      ],
    },
    findExistingAutomation: (a) =>
      a.post?.id === post_id && a.status !== "DELETED",
    onBuildPayload: (form) => ({
      postId: post_id,
      triggers: form.keywords,
      matchType: AUTOMATION_CONFIGS.COMMENT_REPLY.matchType,
      actionType: AUTOMATION_CONFIGS.COMMENT_REPLY.actionType,
      replyMessage: form.dmMessage,
      useVariables: true,
      ...(form.publicReplyEnabled && form.publicReplies.length > 0
        ? {
            commentReplyWhenDm: form.publicReplies
              .map((r) => r.text)
              .join(" | "),
          }
        : {}),
    }),
    successMessage: AUTOMATION_CONFIGS.COMMENT_REPLY.successMessage,
    stopMessage: AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage,
  });

  // Select the appropriate header content based on the automation's current state (loading, fresh, or live)
  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: <FreshHeader isPending={isCreating} />,
    live: existingAutomation ? (
      <LiveHeader
        automation={existingAutomation}
        onStop={stopAutomation}
        isStopping={isStopping}
        onReRun={handleReRun}
        isReRunning={isReRunning}
      />
    ) : null,
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <AutomationLayout
        header={headerContent[pageState]}
        leftCol={
          // Keywords input section for what triggers the automation via comment
          <Controller
            control={control}
            name="keywords"
            render={({ field }) => (
              <AddKeywords value={field.value} onChange={field.onChange} />
            )}
          />
        }
        rightCol={
          <>
            {/* Configuration for public replies and DM content */}
            <Controller
              control={control}
              name="publicReplyEnabled"
              render={({ field: enabledField }) => (
                <Controller
                  control={control}
                  name="publicReplies"
                  render={({ field: repliesField }) => (
                    <PublicReplyToComments
                      enabled={enabledField.value}
                      onEnabledChange={enabledField.onChange}
                      replies={repliesField.value as Reply[]}
                      onRepliesChange={repliesField.onChange}
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="dmMessage"
              render={({ field }) => (
                <SendDm
                  message={field.value}
                  onMessageChange={field.onChange}
                />
              )}
            />
          </>
        }
      />
    </form>
  );
}
