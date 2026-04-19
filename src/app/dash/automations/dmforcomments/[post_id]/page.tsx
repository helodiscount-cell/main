"use client";
import { use } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { instagramKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  commentsAutomationSchema,
  CommentsFormValues,
} from "@/configs/automations";
import { AddKeywords } from "../../_components/widgets";
import {
  BaseAutomationEditor,
  RightColForm,
} from "../../_components/BaseAutomationEditor";
import { AutomationRightCol } from "../../_components/AutomationRightCol";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { useRouter } from "next/navigation";

const DEFAULT_REPLY_ID = "default-reply-1";
const DEFAULT_REPLY_TEXT = "Open your DMs, it's there!";

const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const postsResponse = queryClient.getQueryData<any>(instagramKeys.posts());
  const selectedPost = postsResponse?.result?.data?.find(
    (p: any) => p.id === post_id,
  );

  return (
    <BaseAutomationEditor<CommentsFormValues>
      schema={commentsAutomationSchema}
      defaultValues={{
        automationName: "",
        anyKeyword: false,
        keywords: [],
        dmMessage: "",
        publicReplyEnabled: false,
        publicReplies: [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
        askToFollowEnabled: false,
        askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
        askToFollowLink: "",
        openingMessageEnabled: false,
        openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
        openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
        dmLinks: [],
      }}
      triggerType={AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.COMMENT_REPLY.breadcrumb}
      successMessage={AUTOMATION_CONFIGS.COMMENT_REPLY.successMessage}
      stopMessage={AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage}
      onCreateSuccess={(result) => {
        router.push(`/dash/automations/dmforcomments/edit/${result.id}`);
      }}
      post={
        selectedPost
          ? {
              mediaUrl: selectedPost.media_url,
              mediaType: selectedPost.media_type,
            }
          : null
      }
      onBuildPayload={(form) => ({
        triggerType: AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType,
        postId: post_id,
        automationName: form.automationName,
        postCaption: selectedPost?.caption ?? form.keywords[0] ?? "",
        postMediaUrl: selectedPost?.media_url ?? null,
        postMediaType: selectedPost?.media_type ?? null,
        postThumbnailUrl: selectedPost?.thumbnail_url ?? null,
        postPermalink: selectedPost?.permalink ?? null,
        postTimestamp: selectedPost?.timestamp ?? null,
        anyKeyword: form.anyKeyword,
        triggers: form.keywords,
        matchType: AUTOMATION_CONFIGS.COMMENT_REPLY.matchType,
        actionType: AUTOMATION_CONFIGS.COMMENT_REPLY.actionType,
        replyMessage: form.dmMessage,
        replyImage: form.dmImage || null,
        dmLinks: form.dmLinks || [],
        useVariables: true,
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
      })}
      renderLeftCol={(form) => (
        <div className="flex flex-col gap-6">
          <Controller
            control={form.control}
            name="anyKeyword"
            render={({ field: anyField }) => (
              <Controller
                control={form.control}
                name="keywords"
                render={({ field: keywordsField }) => (
                  <AddKeywords
                    anyKeyword={anyField.value}
                    onAnyKeywordChange={anyField.onChange}
                    keywords={keywordsField.value}
                    onKeywordsChange={keywordsField.onChange}
                  />
                )}
              />
            )}
          />
        </div>
      )}
      renderRightCol={(form: RightColForm<CommentsFormValues>) => (
        <AutomationRightCol
          control={form.control}
          includePublicReply
          onIsUploadingChange={form.setIsMediaUploading}
        />
      )}
    />
  );
};

export default Page;
