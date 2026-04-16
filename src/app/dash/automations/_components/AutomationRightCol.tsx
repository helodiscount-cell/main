"use client";

import { Control, Controller } from "react-hook-form";
import {
  AskToFollow,
  OpeningMessage,
  PublicReplyToComments,
  SendDm,
} from "./widgets";

interface AutomationRightColProps {
  control: Control<any>;
  includePublicReply?: boolean;
}

/**
 * Standard right column widgets for the automation editor.
 * Handles the common Controller blocks for OpeningMessage, SendDm, and AskToFollow.
 */
export function AutomationRightCol({
  control,
  includePublicReply = false,
}: AutomationRightColProps) {
  return (
    <div className="space-y-4">
      {includePublicReply && (
        <Controller
          control={control}
          name="publicReplyEnabled"
          render={({ field: enabledField }) => (
            <Controller
              control={control}
              name="publicReplies"
              render={({ field: repliesField }) => (
                <PublicReplyToComments
                  enabled={enabledField.value}
                  onEnabledChange={enabledField.onChange}
                  replies={repliesField.value}
                  onRepliesChange={repliesField.onChange}
                />
              )}
            />
          )}
        />
      )}

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
  );
}
