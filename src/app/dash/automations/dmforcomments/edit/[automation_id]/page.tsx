"use client";

import { use } from "react";
import { Controller } from "react-hook-form";
import {
  AUTOMATION_CONFIGS,
  commentsAutomationSchema,
  CommentsFormValues,
} from "@/configs/automations";
import { AddKeywords } from "../../../_components/widgets";
import { BaseAutomationEditor } from "../../../_components/BaseAutomationEditor";
import { AutomationRightCol } from "../../../_components/AutomationRightCol";
import { ASK_TO_FOLLOW_CONFIG } from "@/configs/ask-to-follow";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";

const DEFAULT_REPLY_ID = "default-reply-1";
const DEFAULT_REPLY_TEXT = "Open your DMs, it's there!";

const Page = ({ params }: { params: Promise<{ automation_id: string }> }) => {
  const { automation_id } = use(params);

  return (
    <BaseAutomationEditor<CommentsFormValues>
      automationId={automation_id}
      schema={commentsAutomationSchema}
      defaultValues={{
        automationName: "",
        anyKeyword: false,
        keywords: [],
        dmMessage: "",
        publicReplyEnabled: false,
        publicReplies: [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
        askToFollowEnabled: false,
        askToFollowMessage: ASK_TO_FOLLOW_CONFIG.DEFAULT_MESSAGE,
        askToFollowLink: "",
        openingMessageEnabled: false,
        openingMessage: OPENING_MESSAGE_CONFIG.DEFAULT_MESSAGE,
        openingButtonText: OPENING_MESSAGE_CONFIG.DEFAULT_BUTTON_TEXT,
        dmLinks: [],
      }}
      triggerType={AUTOMATION_CONFIGS.COMMENT_REPLY.triggerType}
      breadcrumb={AUTOMATION_CONFIGS.COMMENT_REPLY.breadcrumb}
      successMessage="Automation updated successfully!"
      stopMessage={AUTOMATION_CONFIGS.COMMENT_REPLY.stopMessage}
      onBuildPayload={(form) => ({
        automationName: form.automationName,
        anyKeyword: form.anyKeyword,
        triggers: form.keywords,
        replyMessage: form.dmMessage,
        replyImage: form.dmImage || null,
        dmLinks: form.dmLinks || [],
        commentReplyWhenDm:
          form.publicReplyEnabled && form.publicReplies.length > 0
            ? form.publicReplies.map((r: any) => r.text)
            : [],
        askToFollowEnabled: form.askToFollowEnabled,
        askToFollowMessage: form.askToFollowMessage || null,
        askToFollowLink: form.askToFollowLink || null,
        openingMessageEnabled: form.openingMessageEnabled,
        openingMessage: form.openingMessage || null,
        openingButtonText: form.openingButtonText || null,
      })}
      onPopulateForm={(automation) => ({
        automationName: automation.automationName || "",
        anyKeyword:
          (automation as any).anyKeyword ?? automation.triggers?.length === 0,
        keywords: automation.triggers || [],
        dmMessage: automation.replyMessage || "",
        dmImage: automation.replyImage ?? undefined,
        dmLinks: (automation as any).dmLinks || [],
        publicReplyEnabled:
          !!automation.commentReplyWhenDm &&
          automation.commentReplyWhenDm.length > 0,
        publicReplies:
          automation.commentReplyWhenDm &&
          automation.commentReplyWhenDm.length > 0
            ? (automation.commentReplyWhenDm as string[]).map((text) => ({
                id: crypto.randomUUID(),
                text,
              }))
            : [{ id: DEFAULT_REPLY_ID, text: DEFAULT_REPLY_TEXT }],
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
      renderRightCol={(form) => (
        <AutomationRightCol control={form.control} includePublicReply />
      )}
    />
  );
};

export default Page;
