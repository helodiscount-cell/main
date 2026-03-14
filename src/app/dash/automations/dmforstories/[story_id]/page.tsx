"use client";

import { use } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import { AutomationLayout } from "@/components/dash/automations/AutomationLayout";
import AddKeywords from "@/components/dash/automations/AddKeywords";
import SendDm from "@/components/dash/automations/SendDm";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { FreshHeader } from "@/components/headers/FreshHeader";
import { LiveHeader } from "@/components/headers/LiveHeader";
import { useAutomationManager } from "@/hooks/use-automations";
import {
  AUTOMATION_CONFIGS,
  storyAutomationSchema,
  StoryFormValues,
} from "@/configs/automations";

type StoryMeta = {
  id: string;
  mediaUrl: string;
  mediaType: string;
  caption?: string | null;
  permalink: string;
  timestamp: string;
};

const Page = ({ params }: { params: Promise<{ story_id: string }> }) => {
  const { story_id } = use(params);

  // Fetch stories to get metadata for the selected story
  const { data: storiesData } = useQuery({
    queryKey: instagramKeys.stories(),
    queryFn: () => instagramService.profile.getUserStories(),
  });

  const currentStory = storiesData?.result.stories?.find(
    (s) => s.id === story_id,
  );

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
  } = useAutomationManager<StoryFormValues>({
    schema: storyAutomationSchema,
    defaultValues: {
      keywords: [],
      dmMessage: "",
    },
    findExistingAutomation: (a) =>
      a.triggerType === AUTOMATION_CONFIGS.STORY_REPLY.triggerType &&
      a.story?.id === story_id &&
      a.status !== "DELETED",
    onBuildPayload: (form) => {
      if (!currentStory) return null;

      const storyMeta: StoryMeta = {
        id: currentStory.id,
        mediaUrl: currentStory.media_url,
        mediaType: currentStory.media_type,
        caption: currentStory.caption ?? null,
        permalink: currentStory.permalink,
        timestamp: currentStory.timestamp,
      };

      return {
        triggerType: AUTOMATION_CONFIGS.STORY_REPLY.triggerType,
        story: storyMeta,
        triggers: form.keywords,
        matchType: AUTOMATION_CONFIGS.STORY_REPLY.matchType,
        actionType: AUTOMATION_CONFIGS.STORY_REPLY.actionType,
        replyMessage: form.dmMessage,
        replyImage: form.dmImage || null,
        useVariables: true,
        // Story replies don't have public replies in this version, but we keep it consistent
        commentReplyWhenDm: [],
      };
    },
    onPopulateForm: (automation) => ({
      keywords: automation.triggers || [],
      dmMessage: automation.replyMessage || "",
      dmImage: automation.replyImage ?? undefined,
    }),
    onPayloadInvalid: () => {
      toast.error("Story data not available. Please try again.");
    },
    successMessage: AUTOMATION_CONFIGS.STORY_REPLY.successMessage,
    stopMessage: AUTOMATION_CONFIGS.STORY_REPLY.stopMessage,
  });

  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: (
      <FreshHeader
        isPending={isCreating}
        breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
      />
    ),
    live: existingAutomation ? (
      <LiveHeader
        automation={existingAutomation}
        onStop={stopAutomation}
        isStopping={isStopping}
        onReRun={handleReRun}
        isReRunning={isReRunning}
        isUpdating={isUpdating}
        breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
        label={
          existingAutomation.story?.caption
            ? existingAutomation.story.caption.slice(0, 30) +
              (existingAutomation.story.caption.length > 30 ? "…" : "")
            : `Story ${existingAutomation.story?.id.slice(0, 8) ?? ""}`
        }
      />
    ) : null,
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <AutomationLayout
        header={headerContent[pageState]}
        leftCol={
          <Controller
            control={control}
            name="keywords"
            render={({ field }) => (
              <AddKeywords value={field.value} onChange={field.onChange} />
            )}
          />
        }
        rightCol={
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
        }
      />
    </form>
  );
};

export default Page;
