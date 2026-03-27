"use client";

import { Pencil } from "lucide-react";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";
import { useState } from "react";
import { AutomationInput } from "./AutomationInput";

type Props = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  message: string;
  onMessageChange: (message: string) => void;
  buttonText: string;
  onButtonTextChange: (text: string) => void;
};

const OpeningMessage = ({
  enabled,
  onEnabledChange,
  message,
  onMessageChange,
  buttonText,
  onButtonTextChange,
}: Props) => {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-purple-300 w-full overflow-hidden shadow-sm">
      {/* Header section with toggle */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-sm font-bold text-slate-800">
          {OPENING_MESSAGE_CONFIG.TITLE}
        </span>
        <button
          type="button"
          onClick={() => onEnabledChange(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            enabled ? "bg-[#6A06E4]" : "bg-slate-200"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Unified Message Input */}
          <AutomationInput
            value={message}
            onChange={onMessageChange}
            placeholder="Type your opening message..."
            className="mb-3"
          />

          {/* Button text preview/edit area */}
          <div className="bg-[#F6EFFF] rounded-xl flex items-center justify-between border border-purple-100 group">
            <div className="flex-1 flex items-center gap-2">
              <AutomationInput
                variant="mini"
                type="input"
                value={buttonText}
                onChange={onButtonTextChange}
                placeholder="Button text..."
                className={`p-3 border-none bg-transparent w-full ${!isEditable ? "pointer-events-none opacity-80" : ""}`}
                showEmojiPicker={isEditable}
              />
            </div>
            <button
              onClick={() => setIsEditable(!isEditable)}
              type="button"
              className={`text-[#6A06E4] opacity-80 hover:opacity-100 transition-opacity p-2 ${isEditable ? "text-green-500" : ""}`}
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningMessage;
