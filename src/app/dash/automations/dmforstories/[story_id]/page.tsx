"use client";

import { use } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { instagramService } from "@/api/services/instagram";
import { instagramKeys } from "@/keys/react-query";
import { AutomationLayout } from "@/app/dash/automations/_components/AutomationLayout";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { useAutomationManager } from "@/hooks/use-automations";
import {
  AddKeywords,
  AskToFollow,
  OpeningMessage,
  SendDm,
} from "../../_components/widgets";
import {
  AUTOMATION_CONFIGS,
  storyAutomationSchema,
  StoryFormValues,
} from "@/configs/automations";
import { FreshHeader, LiveHeader } from "@/components/dash/automations/headers";

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
  } = useAutomationManager<StoryFormValues>({
    schema: storyAutomationSchema,
    defaultValues: {
      automationName: "",
      keywords: [],
      dmMessage: "",
      askToFollowEnabled: false,
      askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
      askToFollowLink: "",
      openingMessageEnabled: true,
      openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
      openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
      dmLinks: [],
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
        automationName: form.automationName,
        story: storyMeta,
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
        // Story replies don't have public replies in this version, but we keep it consistent
        commentReplyWhenDm: [],
      };
    },
    onPopulateForm: (automation) => ({
      automationName: automation.automationName || "",
      keywords: automation.triggers || [],
      dmMessage: automation.replyMessage || "",
      dmImage: automation.replyImage ?? undefined,
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
      dmLinks: (automation as any).dmLinks || [],
    }),
    onPayloadInvalid: () => {
      toast.error("Story data not available. Please try again.");
    },
    successMessage: AUTOMATION_CONFIGS.STORY_REPLY.successMessage,
    stopMessage: AUTOMATION_CONFIGS.STORY_REPLY.stopMessage,
  });

  const automationName = watch("automationName");

  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: (
      <FreshHeader
        isPending={isCreating}
        automationName={automationName}
        onNameChange={handleNameChange}
        breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
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
        breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
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
          <div className="space-y-4">
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
          </div>
        }
      />
    </form>
  );
};

export default Page;
