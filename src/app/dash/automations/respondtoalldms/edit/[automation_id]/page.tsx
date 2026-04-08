"use client";
import { use, useMemo } from "react";
import { Controller } from "react-hook-form";
import { AutomationLayout } from "@/app/dash/automations/_components/AutomationLayout";
import { Spinner } from "@/components/ui/spinner";
import { useAutomationManager } from "@/hooks/use-automations";
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
} from "../../../_components/widgets";
import { LiveHeader } from "@/components/dash/automations/headers";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";

const Page = ({ params }: { params: Promise<{ automation_id: string }> }) => {
  const { automation_id } = use(params);

  const {
    form: { control, watch },
    existingAutomation,
    pageState,
    isUpdating,
    isStarting,
    isStopping,
    handleSubmit,
    handleNameChange,
    startAutomation,
    stopAutomation,
  } = useAutomationManager<RespondToAllDMsFormValues>({
    schema: respondToAllDmsSchema,
    automationId: automation_id,
    defaultValues: {
      automationName: "",
      keywords: [],
      dmMessage: "",
      dmImage: "",
      askToFollowEnabled: false,
      askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
      askToFollowLink: "",
      openingMessageEnabled: false,
      openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
      openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
      dmLinks: [],
    },
    onPopulateForm: (auto) => ({
      automationName: auto.automationName || "",
      keywords: auto.triggers || [],
      dmMessage: auto.replyMessage || "",
      dmImage: auto.replyImage || "",
      askToFollowEnabled: auto.askToFollowEnabled ?? false,
      askToFollowMessage:
        auto.askToFollowMessage || ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
      askToFollowLink: auto.askToFollowLink || "",
      openingMessageEnabled: auto.openingMessageEnabled ?? false,
      openingMessage:
        auto.openingMessage || OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
      openingButtonText:
        auto.openingButtonText || OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
      dmLinks: auto.dmLinks || [],
    }),
    onBuildPayload: (form) => ({
      automationName: form.automationName,
      triggers: form.keywords,
      replyMessage: form.dmMessage,
      replyImage: form.dmImage || null,
      dmLinks: form.dmLinks || [],
      askToFollowEnabled: form.askToFollowEnabled,
      askToFollowMessage: form.askToFollowMessage || null,
      askToFollowLink: form.askToFollowLink || null,
      openingMessageEnabled: form.openingMessageEnabled,
      openingMessage: form.openingMessage || null,
      openingButtonText: form.openingButtonText || null,
    }),
    successMessage: "Automation updated successfully!",
    stopMessage: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.stopMessage,
  });

  const automationName = watch("automationName");

  const headerContent = useMemo(
    () => ({
      loading: null,
      live: existingAutomation && (
        <LiveHeader
          automation={existingAutomation}
          onNameChange={handleNameChange}
          isStarting={isStarting}
          isStopping={isStopping}
          isUpdating={isUpdating}
          onStart={startAutomation}
          onStop={stopAutomation}
          breadcrumb={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.breadcrumb}
        />
      ),
      fresh: null,
      "not-found": (
        <div className="text-red-500 font-medium">Automation not found</div>
      ),
    }),
    [
      existingAutomation,
      handleNameChange,
      isStarting,
      isStopping,
      isUpdating,
      startAutomation,
      stopAutomation,
    ],
  );

  if (pageState === "loading") {
    return (
      <div className="flex items-center justify-center h-full bg-[#09090B]">
        <Spinner className="text-[#6A06E4] size-6" strokeWidth={2.5} />
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <AutomationLayout
        header={headerContent["not-found"]}
        leftCol={null}
        rightCol={null}
      />
    );
  }

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <AutomationLayout
        header={headerContent[pageState as keyof typeof headerContent]}
        triggerType="RESPOND_TO_ALL_DMS"
        leftCol={
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
