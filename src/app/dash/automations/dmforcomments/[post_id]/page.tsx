"use client";
import { use } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { FreshHeader } from "@/components/dash/automations/headers";

type Reply = { id: string; text: string };

const DEFAULT_REPLY_ID = "default-reply-1";
const DEFAULT_REPLY_TEXT = "Open your DMs, it's there!";

const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    form: { control, watch },
    pageState,
    isCreating,
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
    onBuildPayload: (form) => {
      // Find the specific post to include its metadata (mediaUrl, permalink, timestamp)
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
    successMessage: AUTOMATION_CONFIGS.COMMENT_REPLY.successMessage,
    stopMessage: AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage,
    onCreateSuccess: (result) => {
      router.push(`/dash/automations/dmforcomments/edit/${result.id}`);
    },
  });

  const automationName = watch("automationName");

  // Creation page always uses the FreshHeader
  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: (
      <FreshHeader
        isPending={isCreating}
        automationName={automationName}
        onNameChange={handleNameChange}
      />
    ),
    live: null, // Creation pages don't have a live state anymore
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <AutomationLayout
        header={headerContent[pageState as keyof typeof headerContent]}
        leftCol={
          // Keywords input section for what triggers the automation via comment
          <div className="flex flex-col gap-6">
            <Controller
              control={control}
              name="keywords"
              render={({ field }) => (
                <AddKeywords value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
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
