"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { instagramKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  COMMENTS_DEFAULT_VALUES,
  CommentsFormValues,
  commentsAutomationSchema,
} from "@/configs/automations.config";
import {
  BaseAutomationEditor,
  RightColForm,
} from "@/features/automations/components/editor/BaseAutomationEditor";
import { AutomationRightCol } from "@/features/automations/components/editor/AutomationRightCol";
import { AddKeywords } from "@/features/automations/components/widgets";

const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Grab the post from the already-cached posts query
  const postsResponse = queryClient.getQueryData<{
    result: {
      data: Array<{
        id: string;
        media_url?: string;
        media_type?: string;
        thumbnail_url?: string;
        permalink?: string;
        timestamp?: string;
        caption?: string;
      }>;
    };
  }>(instagramKeys.posts());
  const selectedPost = postsResponse?.result?.data?.find(
    (p) => p.id === post_id,
  );

  return (
    <BaseAutomationEditor<CommentsFormValues>
      schema={commentsAutomationSchema}
      defaultValues={COMMENTS_DEFAULT_VALUES}
      triggerType={AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.COMMENT_REPLY.breadcrumb}
      successMessage={AUTOMATION_CONFIGS.COMMENT_REPLY.successMessage}
      stopMessage={AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage}
      onCreateSuccess={(result) =>
        router.push(`/dash/automations/${result.id}`)
      }
      post={
        selectedPost
          ? {
              mediaUrl: selectedPost.media_url ?? null,
              mediaType: selectedPost.media_type ?? null,
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
            ? form.publicReplies.map((r) => r.text)
            : [],
        askToFollowEnabled: form.askToFollowEnabled,
        askToFollowMessage: form.askToFollowMessage || null,
        askToFollowLink: form.askToFollowLink || null,
        openingMessageEnabled: form.openingMessageEnabled,
        openingMessage: form.openingMessage || null,
        openingButtonText: form.openingButtonText || null,
      })}
      renderLeftCol={(form) => (
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
      )}
      renderRightCol={(form: RightColForm<CommentsFormValues>) => (
        <AutomationRightCol
          control={form.control as never}
          includePublicReply
          onIsUploadingChange={form.setIsMediaUploading}
        />
      )}
    />
  );
};

export default Page;
