"use client";
import { useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { AutomationLayout } from "@/app/dash/automations/_components/AutomationLayout";
import { HeaderSkeleton } from "@/components/Loaders/HeaderSkeleton";
import { useAutomationManager } from "@/hooks/use-automations";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import {
  AUTOMATION_CONFIGS,
  respondToAllDmsSchema,
  RespondToAllDMsFormValues,
} from "@/configs/automations";
import {
  AddKeywords,
  AskToFollow,
  OpeningMessage,
  SendDm,
} from "../_components/widgets";
import { FreshHeader } from "@/components/dash/automations/headers";
import { ExistingAutomationsBlock } from "@/components/dash/automations/create/ExistingAutomationsBlock";

const Page = () => {
  const queryClient = useQueryClient();
  const {
    form: { control, watch },
    pageState,
    isCreating,
    handleSubmit,
    handleNameChange,
  } = useAutomationManager<RespondToAllDMsFormValues>({
    schema: respondToAllDmsSchema,
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
        triggerType: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.triggerType,
        automationName: form.automationName,
        triggers: form.keywords,
        matchType: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.matchType,
        actionType: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.actionType,
        replyMessage: form.dmMessage,
        replyImage: form.dmImage || null,
        dmLinks: form.dmLinks || [],
        useVariables: true,
        askToFollowEnabled: form.askToFollowEnabled,
        askToFollowMessage: form.askToFollowMessage || null,
        askToFollowLink: form.askToFollowLink || null,
        openingMessageEnabled: form.openingMessageEnabled,
        openingMessage: form.openingMessage || null,
        openingButtonText: form.openingButtonText || null,
      };
    },
    successMessage: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.successMessage,
    stopMessage: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.stopMessage,
  });

  const automationName = watch("automationName");

  const headerContent = {
    loading: <HeaderSkeleton />,
    fresh: (
      <FreshHeader
        isPending={isCreating}
        automationName={automationName}
        onNameChange={handleNameChange}
        breadcrumb={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.breadcrumb}
      />
    ),
    live: null,
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <AutomationLayout
        header={headerContent[pageState as keyof typeof headerContent]}
        leftCol={
          <div className="flex flex-col gap-6">
            <Controller
              control={control}
              name="keywords"
              render={({ field }) => (
                <AddKeywords value={field.value} onChange={field.onChange} />
              )}
            />
            {/* Passive awareness block for account-level automations */}
            <ExistingAutomationsBlock targetId="account" type="account" />
          </div>
        }
        rightCol={
          <>
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
