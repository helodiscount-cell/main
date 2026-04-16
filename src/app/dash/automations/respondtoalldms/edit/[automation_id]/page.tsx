"use client";

import { use } from "react";
import { Controller } from "react-hook-form";
import {
  AUTOMATION_CONFIGS,
  respondToAllDmsSchema,
  RespondToAllDMsFormValues,
} from "@/configs/automations";
import { AddKeywords } from "../../../_components/widgets";
import { BaseAutomationEditor } from "../../../_components/BaseAutomationEditor";
import { AutomationRightCol } from "../../../_components/AutomationRightCol";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";

const Page = ({ params }: { params: Promise<{ automation_id: string }> }) => {
  const { automation_id } = use(params);

  return (
    <BaseAutomationEditor<RespondToAllDMsFormValues>
      automationId={automation_id}
      schema={respondToAllDmsSchema}
      defaultValues={{
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
      }}
      triggerType={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.breadcrumb}
      successMessage="Automation updated successfully!"
      stopMessage={AUTOMATION_CONFIGS.RESPOND_TO_ALL_DMS.stopMessage}
      onBuildPayload={(form) => ({
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
      })}
      onPopulateForm={(auto) => ({
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
      })}
      renderLeftCol={(form) => (
        <div className="flex flex-col gap-6">
          <Controller
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <AddKeywords value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      )}
      renderRightCol={(form) => <AutomationRightCol control={form.control} />}
    />
  );
};

export default Page;
