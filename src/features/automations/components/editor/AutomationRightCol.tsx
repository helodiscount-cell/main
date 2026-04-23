"use client";

import { Control, useWatch, useFormContext } from "react-hook-form";
import {
  AskToFollow,
  OpeningMessage,
  PublicReplyToComments,
  SendDm,
} from "../widgets";
import {
  CommentsFormValues,
  RespondToAllDMsFormValues,
} from "@/configs/automations.config";

// Union of all form shapes that use the right column
type SupportedFormValues = CommentsFormValues | RespondToAllDMsFormValues;

interface AutomationRightColProps {
  control: Control<SupportedFormValues>;
  includePublicReply?: boolean;
  onIsUploadingChange?: (isUploading: boolean) => void;
}

/**
 * Standard right column widgets for all automation editors.
 * Using useWatch instead of nested Controller chains for cleaner JSX.
 */
export function AutomationRightCol({
  control,
  includePublicReply = false,
  onIsUploadingChange,
}: AutomationRightColProps) {
  // Flatten all field values via useWatch — avoids the nested Controller pyramid
  const [
    publicReplyEnabled,
    publicReplies,
    openingMessageEnabled,
    openingMessage,
    openingButtonText,
    dmMessage,
    dmImage,
    dmLinks,
    askToFollowEnabled,
    askToFollowMessage,
  ] = useWatch({
    control,
    name: [
      "publicReplyEnabled" as never,
      "publicReplies" as never,
      "openingMessageEnabled",
      "openingMessage",
      "openingButtonText",
      "dmMessage",
      "dmImage",
      "dmLinks",
      "askToFollowEnabled",
      "askToFollowMessage",
    ],
  });

  const { setValue } = useFormContext<SupportedFormValues>();

  return (
    <div className="space-y-4">
      {includePublicReply && (
        <PublicReplyToComments
          enabled={!!publicReplyEnabled}
          onEnabledChange={(v) =>
            setValue("publicReplyEnabled" as never, v as never)
          }
          replies={publicReplies ?? []}
          onRepliesChange={(v) =>
            setValue("publicReplies" as never, v as never)
          }
        />
      )}

      <OpeningMessage
        enabled={!!openingMessageEnabled}
        onEnabledChange={(v) => setValue("openingMessageEnabled", v)}
        message={openingMessage ?? ""}
        onMessageChange={(v) => setValue("openingMessage", v)}
        buttonText={openingButtonText ?? ""}
        onButtonTextChange={(v) => setValue("openingButtonText", v)}
      />

      <SendDm
        message={dmMessage ?? ""}
        onMessageChange={(v) => setValue("dmMessage", v)}
        imageUrl={dmImage}
        onImageChange={(v) => setValue("dmImage" as never, v as never)}
        links={dmLinks ?? []}
        onLinksChange={(v) => setValue("dmLinks" as never, v as never)}
        onIsUploadingChange={onIsUploadingChange}
      />

      <AskToFollow
        enabled={!!askToFollowEnabled}
        onEnabledChange={(v) => setValue("askToFollowEnabled", v)}
        message={askToFollowMessage ?? ""}
        onMessageChange={(v) => setValue("askToFollowMessage", v)}
      />
    </div>
  );
}
