"use client";

import { use } from "react";
import { Controller } from "react-hook-form";
import { AutomationLayout } from "@/app/dash/automations/_components/AutomationLayout";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { useAutomationManager } from "@/hooks/use-automations";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import {
  AUTOMATION_CONFIGS,
  storyAutomationSchema,
  StoryFormValues,
} from "@/configs/automations";
import {
  AddKeywords,
  AskToFollow,
  OpeningMessage,
  SendDm,
} from "../../../_components/widgets";
import { LiveHeader } from "@/components/dash/automations/headers";

const Page = ({ params }: { params: Promise<{ automation_id: string }> }) => {
  const { automation_id } = use(params);

  const {
    form: { control, watch },
    existingAutomation,
    pageState,
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
    automationId: automation_id,
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
    onBuildPayload: (form) => {
      return {
        automationName: form.automationName,
        triggers: form.keywords,
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
    successMessage: "Automation updated successfully!",
    stopMessage: AUTOMATION_CONFIGS.STORY_REPLY.stopMessage,
  });

  const automationName = watch("automationName");

  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: null,
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

  if (pageState === "loading") {
    return (
      <div className="flex flex-col h-full bg-[#09090B]">
        <HeaderSkeleton />
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex gap-6 h-full animate-pulse opacity-50">
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10" />
            <div className="flex-[0.6] bg-white/5 rounded-2xl border border-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <p className="text-lg">Automation not found</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <AutomationLayout
        header={headerContent[pageState as keyof typeof headerContent]}
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
