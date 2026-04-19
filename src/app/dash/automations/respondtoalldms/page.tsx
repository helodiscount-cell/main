"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import {
  AUTOMATION_CONFIGS,
  respondToAllDmsSchema,
  RespondToAllDMsFormValues,
} from "@/configs/automations";
import { AddKeywords } from "../_components/widgets";
import { BaseAutomationEditor } from "../_components/BaseAutomationEditor";
import { AutomationRightCol } from "../_components/AutomationRightCol";

const Page = () => {
  const router = useRouter();

  return (
    <BaseAutomationEditor<RespondToAllDMsFormValues>
      schema={respondToAllDmsSchema}
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
      triggerType={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.breadcrumb}
      successMessage={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.successMessage}
      stopMessage={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.stopMessage}
      onCreateSuccess={(result) => {
        router.push(`/dash/automations/respondtoalldms/edit/${result.id}`);
      }}
      onBuildPayload={(form) => ({
        triggerType: AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.triggerType,
        automationName: form.automationName,
        anyKeyword: form.anyKeyword,
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
      renderRightCol={(form: any) => (
        <AutomationRightCol
          control={form.control}
          onIsUploadingChange={form.setIsMediaUploading}
        />
      )}
    />
  );
};

export default Page;
