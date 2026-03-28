"use client";
import { use } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { AutomationLayout } from "@/app/dash/automations/_components/AutomationLayout";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { useAutomationManager } from "@/hooks/use-automations";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { instagramKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  commentsAutomationSchema,
  CommentsFormValues,
} from "@/configs/automations";
import {
  AddKeywords,
  PublicReplyToComments,
  AskToFollow,
  OpeningMessage,
  SendDm,
} from "../../_components/widgets";
import { FreshHeader, LiveHeader } from "@/components/dash/automations/headers";

type Reply = { id: string; text: string };

const DEFAULT_REPLY_ID = "default-reply-1";
const DEFAULT_REPLY_TEXT = "Open your DMs, it's there!";

const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);
  const queryClient = useQueryClient();
  const {
    form: { control, watch },
    existingAutomation,
    pageState,
    isCreating,
    isUpdating,
    isStopping,
    isStarting,
    stopAutomation,
    startAutomation,
    isReRunning,
    handleReRun,
    handleSubmit,
    handleNameChange,
  } = useAutomationManager<CommentsFormValues>({
    schema: commentsAutomationSchema,
    defaultValues: {
      automationName: "",
      keywords: [],
      dmMessage: "",
      publicReplyEnabled: true,
      publicReplies: [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
      askToFollowEnabled: false,
      askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
      askToFollowLink: "",
      openingMessageEnabled: true,
      openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
      openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
      dmLinks: [],
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
        triggerType: AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType,
        postId: post_id,
        automationName: form.automationName,
        postCaption: selectedPost?.caption ?? form.keywords[0] ?? "",
        postMediaUrl: selectedPost?.media_url ?? null,
        postMediaType: selectedPost?.media_type ?? null,
        postThumbnailUrl: selectedPost?.thumbnail_url ?? null,
        postPermalink: selectedPost?.permalink ?? null,
        postTimestamp: selectedPost?.timestamp ?? null,
        triggers: form.keywords,
        matchType: AUTOMATION_CONFIGS.COMMENT_REPLY.matchType,
        actionType: AUTOMATION_CONFIGS.COMMENT_REPLY.actionType,
        replyMessage: form.dmMessage,
        replyImage: form.dmImage || null,
        dmLinks: form.dmLinks || [],
        useVariables: true,
        // Always pass commentReplyWhenDm to ensure it clears if toggled off
        commentReplyWhenDm:
          form.publicReplyEnabled && form.publicReplies.length > 0
            ? form.publicReplies.map((r: any) => r.text)
            : [],
        askToFollowEnabled: form.askToFollowEnabled,
        askToFollowMessage: form.askToFollowMessage || null,
        askToFollowLink: form.askToFollowLink || null,
        openingMessageEnabled: form.openingMessageEnabled,
        openingMessage: form.openingMessage || null,
        openingButtonText: form.openingButtonText || null,
      };
    },
    onPopulateForm: (automation) => ({
      automationName: automation.automationName || "",
      keywords: automation.triggers || [],
      dmMessage: automation.replyMessage || "",
      dmImage: automation.replyImage ?? undefined,
      dmLinks: (automation as any).dmLinks || [],
      publicReplyEnabled:
        !!automation.commentReplyWhenDm &&
        automation.commentReplyWhenDm.length > 0,
      publicReplies:
        automation.commentReplyWhenDm &&
        automation.commentReplyWhenDm.length > 0
          ? (automation.commentReplyWhenDm as string[]).map((text) => ({
              id: crypto.randomUUID(), // This is fine here as it's only called during reset
              text,
            }))
          : [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
      askToFollowEnabled: automation.askToFollowEnabled || false,
      askToFollowMessage:
        automation.askToFollowMessage || ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
      askToFollowLink: automation.askToFollowLink || "",
      openingMessageEnabled: automation.openingMessageEnabled ?? true,
      openingMessage:
        automation.openingMessage || OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
      openingButtonText:
        automation.openingButtonText ||
        OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
    }),
    successMessage: AUTOMATION_CONFIGS.COMMENT_REPLY.successMessage,
    stopMessage: AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage,
  });

  const automationName = watch("automationName");

  // Select the appropriate header content based on the automation's current state (loading, fresh, or live)
  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: (
      <FreshHeader
        isPending={isCreating}
        automationName={automationName}
        onNameChange={handleNameChange}
      />
    ),
    live: existingAutomation ? (
      <LiveHeader
        automation={existingAutomation}
        onStop={stopAutomation}
        isStopping={isStopping}
        onStart={startAutomation}
        isStarting={isStarting}
        onReRun={handleReRun}
        isReRunning={isReRunning}
        isUpdating={isUpdating}
        onNameChange={handleNameChange}
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
              name="openingMessageEnabled"
              render={({ field: enabledField }) => (
                <Controller
                  control={control}
                  name="openingMessage"
                  render={({ field: messageField }) => (
                    <Controller
                      control={control}
                      name="openingButtonText"
                      render={({ field: buttonField }) => (
                        <OpeningMessage
                          enabled={enabledField.value}
                          onEnabledChange={enabledField.onChange}
                          message={messageField.value || ""}
                          onMessageChange={messageField.onChange}
                          buttonText={buttonField.value || ""}
                          onButtonTextChange={buttonField.onChange}
                        />
                      )}
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
                    <Controller
                      control={control}
                      name="dmLinks"
                      render={({ field: linksField }) => (
                        <SendDm
                          message={field.value}
                          onMessageChange={field.onChange}
                          imageUrl={imageField.value}
                          onImageChange={imageField.onChange}
                          links={linksField.value || []}
                          onLinksChange={linksField.onChange}
                        />
                      )}
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
};

export default Page;
