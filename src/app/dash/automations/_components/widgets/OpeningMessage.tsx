"use client";

import { Pencil } from "lucide-react";
import { OPENING_MESSAGE_CONFIG } from "@/configs/opening-message";

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
          {/* Main message area */}
          <div className="bg-[#F8F9FB] rounded-xl p-4 border border-slate-100 mb-3">
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              className="w-full bg-transparent text-[15px] leading-relaxed text-slate-700 outline-none resize-none placeholder:text-slate-400 min-h-[100px]"
              placeholder="Type your opening message..."
            />
          </div>

          {/* Button text preview/edit area */}
          <div className="bg-[#F6EFFF] rounded-xl px-4 py-3.5 flex items-center justify-between border border-purple-100 group">
            <input
              type="text"
              value={buttonText}
              onChange={(e) => onButtonTextChange(e.target.value)}
              className="bg-transparent text-[14px] font-medium text-slate-700 outline-none w-full"
              placeholder="Button text..."
            />
            <button
              type="button"
              className="text-[#6A06E4] opacity-80 hover:opacity-100 transition-opacity"
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
