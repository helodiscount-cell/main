"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import {
  AUTOMATION_CONFIGS,
  DMS_DEFAULT_VALUES,
  RespondToAllDMsFormValues,
  respondToAllDmsSchema,
} from "@/configs/automations.config";
import {
  BaseAutomationEditor,
  RightColForm,
} from "@/features/automations/components/editor/BaseAutomationEditor";
import { AutomationRightCol } from "@/features/automations/components/editor/AutomationRightCol";
import { AddKeywords } from "@/features/automations/components/widgets";

const Page = () => {
  const router = useRouter();

  return (
    <BaseAutomationEditor<RespondToAllDMsFormValues>
      schema={respondToAllDmsSchema}
      defaultValues={DMS_DEFAULT_VALUES}
      triggerType={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.breadcrumb}
      successMessage={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.successMessage}
      stopMessage={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.stopMessage}
      onCreateSuccess={(result) =>
        router.push(`/dash/automations/${result.id}`)
      }
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
      renderRightCol={(form: RightColForm<RespondToAllDMsFormValues>) => (
        <AutomationRightCol
          control={form.control as never}
          onIsUploadingChange={form.setIsMediaUploading}
        />
      )}
    />
  );
};

export default Page;
