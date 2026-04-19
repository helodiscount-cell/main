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
      successMessage="Automation updated successfully!"
      stopMessage={AUTOMATION_CONFIGS.STORY_REPLY.stopMessage}
      onBuildPayload={(form) => ({
        automationName: form.automationName,
        anyKeyword: form.anyKeyword,
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
        anyKeyword:
          (automation as any).anyKeyword ?? automation.triggers?.length === 0,
        keywords: automation.triggers || [],
        dmMessage: automation.replyMessage || "",
        dmImage: automation.replyImage ?? undefined,
        askToFollowEnabled: automation.askToFollowEnabled || false,
        askToFollowMessage:
          automation.askToFollowMessage || ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
        askToFollowLink: automation.askToFollowLink || "",
        openingMessageEnabled: automation.openingMessageEnabled ?? false,
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
      renderRightCol={(form) => <AutomationRightCol control={form.control} />}
    />
  );
};

export default Page;
