"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import {
  AUTOMATION_CONFIGS,
  storyAutomationSchema,
  StoryFormValues,
} from "@/configs/automations";
import { AddKeywords } from "../../_components/widgets";
import { BaseAutomationEditor } from "../../_components/BaseAutomationEditor";
import { AutomationRightCol } from "../../_components/AutomationRightCol";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";

type StoryMeta = {
  id: string;
  mediaUrl: string;
  mediaType: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  permalink: string;
  timestamp: string;
};

const Page = ({ params }: { params: Promise<{ story_id: string }> }) => {
  const { story_id } = use(params);
  const router = useRouter();

  // Fetch stories to get metadata for the selected story
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
      defaultValues={{
        automationName: "",
        anyKeyword: false,
        keywords: [],
        dmMessage: "",
        askToFollowEnabled: false,
        askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
        askToFollowLink: "",
        openingMessageEnabled: false,
        openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
        openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
        dmLinks: [],
      }}
      triggerType={AUTOMATION_CONFIGS.STORY_REPLY.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
      successMessage={AUTOMATION_CONFIGS.STORY_REPLY.successMessage}
      stopMessage={AUTOMATION_CONFIGS.STORY_REPLY.stopMessage}
      onCreateSuccess={(result) => {
        router.push(`/dash/automations/dmforstories/edit/${result.id}`);
      }}
      post={
        currentStory && currentStory.media_url
          ? {
              mediaUrl: currentStory.media_url,
              mediaType: currentStory.media_type,
            }
          : null
      }
      onBuildPayload={(form) => {
        if (!currentStory || !currentStory.media_url) return null;

        const storyMeta: StoryMeta = {
          id: currentStory.id,
          mediaUrl: currentStory.media_url,
          mediaType: currentStory.media_type,
          thumbnailUrl: (currentStory as any).thumbnail_url ?? null,
          caption: currentStory.caption ?? null,
          permalink: currentStory.permalink,
          timestamp: currentStory.timestamp,
        };

        return {
          triggerType: AUTOMATION_CONFIGS.STORY_REPLY.triggerType,
          automationName: form.automationName,
          story: storyMeta,
          anyKeyword: form.anyKeyword,
          triggers: form.keywords,
          matchType: AUTOMATION_CONFIGS.STORY_REPLY.matchType,
          actionType: AUTOMATION_CONFIGS.STORY_REPLY.actionType,
          replyMessage: form.dmMessage,
          replyImage: form.dmImage || null,
          useVariables: true,
          askToFollowEnabled: form.askToFollowEnabled,
          askToFollowMessage: form.askToFollowMessage || null,
          askToFollowLink: form.askToFollowLink || null,
          openingMessageEnabled: form.openingMessageEnabled,
          openingMessage: form.openingMessage || null,
          openingButtonText: form.openingButtonText || null,
          dmLinks: form.dmLinks || [],
          commentReplyWhenDm: [],
        };
      }}
      onPayloadInvalid={() => {
        toast.error("Story data not available. Please try again.");
      }}
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
      renderRightCol={(form) => <AutomationRightCol control={form.control} />}
    />
  );
};

export default Page;
