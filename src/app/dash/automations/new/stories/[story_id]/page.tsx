"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  STORY_DEFAULT_VALUES,
  StoryFormValues,
  storyAutomationSchema,
} from "@/configs/automations.config";
import {
  BaseAutomationEditor,
  RightColForm,
} from "@/features/automations/components/editor/BaseAutomationEditor";
import { AutomationRightCol } from "@/features/automations/components/editor/AutomationRightCol";
import { KeywordsLeftCol } from "@/features/automations/components/editor/KeywordsLeftCol";
import { buildAutomationPayload } from "@/features/automations/utils/automation-payload";

const Page = ({ params }: { params: Promise<{ story_id: string }> }) => {
  const { story_id } = use(params);
  const router = useRouter();

  // Fetch stories to obtain metadata for the selected story
  const { data: storiesData } = useQuery({
    queryKey: instagramKeys.stories(),
    queryFn: () => instagramService.profile.getUserStories(),
  });

  const currentStory = storiesData?.result.stories?.find(
    (s) => s.id === story_id,
  );

  return (
    <BaseAutomationEditor<StoryFormValues>
      schema={storyAutomationSchema}
      defaultValues={STORY_DEFAULT_VALUES}
      triggerType={AUTOMATION_CONFIGS.STORY_REPLY.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
      successMessage={AUTOMATION_CONFIGS.STORY_REPLY.successMessage}
      stopMessage={AUTOMATION_CONFIGS.STORY_REPLY.stopMessage}
      onCreateSuccess={(result) =>
        router.push(`/dash/automations/${result.id}`)
      }
      post={
        currentStory?.media_url
          ? {
              mediaUrl: currentStory.media_url,
              mediaType: currentStory.media_type,
            }
          : null
      }
      onBuildPayload={(form) => {
        if (!currentStory?.media_url) return null;
        return {
          ...buildAutomationPayload(form),
          triggerType: AUTOMATION_CONFIGS.STORY_REPLY.triggerType,
          story: {
            id: currentStory.id,
            mediaUrl: currentStory.media_url,
            mediaType: currentStory.media_type,
            thumbnailUrl:
              ((currentStory as unknown as Record<string, unknown>)
                .thumbnail_url as string) ?? null,
            caption: currentStory.caption ?? null,
            permalink: currentStory.permalink,
            timestamp: currentStory.timestamp,
          },
          matchType: AUTOMATION_CONFIGS.STORY_REPLY.matchType,
          actionType: AUTOMATION_CONFIGS.STORY_REPLY.actionType,
        };
      }}
      onPayloadInvalid={() =>
        toast.error("Story data not available. Please try again.")
      }
      renderLeftCol={(form) => <KeywordsLeftCol control={form.control} />}
      renderRightCol={(form: RightColForm<StoryFormValues>) => (
        <AutomationRightCol
          control={form.control}
          onIsUploadingChange={form.setIsMediaUploading}
        />
      )}
    />
  );
};

export default Page;
