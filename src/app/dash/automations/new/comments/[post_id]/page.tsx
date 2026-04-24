"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import { Spinner } from "@/components/ui/spinner";
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
import { KeywordsLeftCol } from "@/features/automations/components/editor/KeywordsLeftCol";

import { buildAutomationPayload } from "@/features/automations/utils/automation-payload";

const Page = ({ params }: { params: Promise<{ post_id: string }> }) => {
  const { post_id } = use(params);
  const router = useRouter();
  // Fetch posts to obtain metadata for the selected post
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: instagramKeys.posts(),
    queryFn: () => instagramService.profile.getUserPosts(),
  });

  const selectedPost = postsResponse?.result?.data?.find(
    (p) => p.id === post_id,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#09090B]">
        <Spinner className="text-[#6A06E4] size-6" strokeWidth={2.5} />
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p className="text-lg">Post not found</p>
      </div>
    );
  }

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
      post={{
        mediaUrl: selectedPost.media_url ?? null,
        mediaType: selectedPost.media_type ?? null,
      }}
      onBuildPayload={(form) => ({
        ...buildAutomationPayload(form),
        triggerType: AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType,
        postId: post_id,
        postCaption: selectedPost.caption ?? form.keywords[0] ?? "",
        postMediaUrl: selectedPost.media_url ?? null,
        postMediaType: selectedPost.media_type ?? null,
        postThumbnailUrl: selectedPost.thumbnail_url ?? null,
        postPermalink: selectedPost.permalink ?? null,
        postTimestamp: selectedPost.timestamp ?? null,
        matchType: AUTOMATION_CONFIGS.COMMENT_REPLY.matchType,
        actionType: AUTOMATION_CONFIGS.COMMENT_REPLY.actionType,
      })}
      onPayloadInvalid={() =>
        toast.error("Post data not available. Please try again.")
      }
      renderLeftCol={(form) => <KeywordsLeftCol control={form.control} />}
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
