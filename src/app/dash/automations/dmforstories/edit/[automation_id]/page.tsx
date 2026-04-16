"use client";

import { use } from "react";
import { Controller } from "react-hook-form";
import {
  AUTOMATION_CONFIGS,
  storyAutomationSchema,
  StoryFormValues,
} from "@/configs/automations";
import { AddKeywords } from "../../../_components/widgets";
import { BaseAutomationEditor } from "../../../_components/BaseAutomationEditor";
import { AutomationRightCol } from "../../../_components/AutomationRightCol";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";

const Page = ({ params }: { params: Promise<{ automation_id: string }> }) => {
  const { automation_id } = use(params);

  return (
    <BaseAutomationEditor<StoryFormValues>
      automationId={automation_id}
      schema={storyAutomationSchema}
      defaultValues={{
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
      }}
      triggerType={AUTOMATION_CONFIGS.STORY_REPLY.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.STORY_REPLY.breadcrumb}
      successMessage="Automation updated successfully!"
      stopMessage={AUTOMATION_CONFIGS.STORY_REPLY.stopMessage}
      onBuildPayload={(form) => ({
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
      })}
      onPopulateForm={(automation) => ({
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
      })}
      renderLeftCol={(form) => (
        <Controller
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <AddKeywords value={field.value} onChange={field.onChange} />
          )}
        />
      )}
      renderRightCol={(form) => <AutomationRightCol control={form.control} />}
    />
  );
};

export default Page;
