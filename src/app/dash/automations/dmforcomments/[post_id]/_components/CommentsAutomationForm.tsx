"use client";
import { useQueryClient } from "@tanstack/react-query";

import { Controller } from "react-hook-form";
import { AutomationLayout } from "@/components/dash/automations/AutomationLayout";
import AddKeywords from "@/components/dash/automations/AddKeywords";
import PublicReplyToComments from "@/components/dash/automations/PublicReplyToComments";
import SendDm from "@/components/dash/automations/SendDm";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { FreshHeader } from "@/components/headers/FreshHeader";
import { LiveHeader } from "@/components/headers/LiveHeader";
import { useAutomationManager } from "@/hooks/use-automations";
import AskToFollow from "@/components/dash/automations/AskToFollow";
import { instagramKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  commentsAutomationSchema,
  CommentsFormValues,
} from "@/configs/automations";

type Reply = { id: string; text: string };

interface CommentsAutomationFormProps {
  post_id: string;
}

const DEFAULT_REPLY_ID = "default-reply-1";
const DEFAULT_REPLY_TEXT = "Open your DMs, it's there!";

export function CommentsAutomationForm({
  post_id,
}: CommentsAutomationFormProps) {
  const queryClient = useQueryClient();
  const {
    form: { control },
    existingAutomation,
    pageState,
    isCreating,
    isUpdating,
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
      publicReplies: [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
      askToFollowEnabled: false,
      askToFollowMessage: "",
      askToFollowLink: "",
    },
    findExistingAutomation: (a) =>
      a.post?.id === post_id && a.status !== "DELETED",
    onBuildPayload: (form) => {
      // Find the specific post to include its metadata (mediaUrl, permalink, timestamp)
      // This is crucial for the "Best Performer" widget which needs snapshots of these values
      const postsResponse = queryClient.getQueryData<any>(
        instagramKeys.posts(),
      );
      const posts = postsResponse?.result?.data?.data || [];

      const selectedPost = posts.find((p: any) => p.id === post_id);

      return {
        postId: post_id,
        postCaption: selectedPost?.caption ?? form.keywords[0] ?? "",
        postMediaUrl: selectedPost?.media_url ?? null,
        postPermalink: selectedPost?.permalink ?? null,
        postTimestamp: selectedPost?.timestamp ?? null,
        triggers: form.keywords,
        matchType: AUTOMATION_CONFIGS.COMMENT_REPLY.matchType,
        actionType: AUTOMATION_CONFIGS.COMMENT_REPLY.actionType,
        replyMessage: form.dmMessage,
        replyImage: form.dmImage,
        useVariables: true,
        // Pass each public reply as a separate array entry — worker picks one randomly
        ...(form.publicReplyEnabled && form.publicReplies.length > 0
          ? { commentReplyWhenDm: form.publicReplies.map((r) => r.text) }
          : {}),
        askToFollowEnabled: form.askToFollowEnabled,
        askToFollowMessage: form.askToFollowMessage,
        askToFollowLink: form.askToFollowLink,
      };
    },
    onPopulateForm: (automation) => ({
      keywords: automation.triggers || [],
      dmMessage: automation.replyMessage || "",
      dmImage: automation.replyImage ?? undefined,
      publicReplyEnabled:
        !!automation.commentReplyWhenDm &&
        automation.commentReplyWhenDm.length > 0,
      publicReplies:
        automation.commentReplyWhenDm &&
        automation.commentReplyWhenDm.length > 0
          ? automation.commentReplyWhenDm.map((text) => ({
              id: crypto.randomUUID(), // This is fine here as it's only called during reset
              text,
            }))
          : [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
      askToFollowEnabled: automation.askToFollowEnabled || false,
      askToFollowMessage: automation.askToFollowMessage || "",
      askToFollowLink: automation.askToFollowLink || "",
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
        isUpdating={isUpdating}
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
                <Controller
                  control={control}
                  name="dmImage"
                  render={({ field: imageField }) => (
                    <SendDm
                      message={field.value}
                      onMessageChange={field.onChange}
                      imageUrl={imageField.value}
                      onImageChange={imageField.onChange}
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="askToFollowEnabled"
              render={({ field: enabledField }) => (
                <Controller
                  control={control}
                  name="askToFollowMessage"
                  render={({ field: messageField }) => (
                    <Controller
                      control={control}
                      name="askToFollowLink"
                      render={({ field: linkField }) => (
                        <AskToFollow
                          enabled={enabledField.value}
                          onEnabledChange={enabledField.onChange}
                          message={messageField.value || ""}
                          onMessageChange={messageField.onChange}
                          link={linkField.value || ""}
                          onLinkChange={linkField.onChange}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          </>
        }
      />
    </form>
  );
}
