"use client";

import { useEmojiInsertion } from "@/hooks/use-emoji-insertion";
import { EmojiPicker } from "@/components/ui/emoji-picker";

interface AutomationInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: "textarea" | "input";
  rows?: number;
  className?: string;
  showEmojiPicker?: boolean;
  showCharCount?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  variant?: "standard" | "mini";
  autoFocus?: boolean;
}

/**
 * A unified input component for automation widgets that standardizes
 * styling, character counting, and emoji picker integration.
 */
export function AutomationInput({
  value,
  onChange,
  placeholder,
  maxLength,
  type = "textarea",
  rows = 3,
  className = "",
  showEmojiPicker = true,
  showCharCount = true,
  onKeyDown,
  onBlur,
  variant = "standard",
  autoFocus,
}: AutomationInputProps) {
  // Use our centralized hook for emoji insertion
  const { ref, handleEmojiSelect } = useEmojiInsertion<any>(
    value,
    onChange,
    maxLength,
  );

  const isMini = variant === "mini";

  const containerStyle = isMini
    ? "relative flex items-center gap-2 transition-all duration-200"
    : "relative bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 focus-within:border-purple-200 focus-within:bg-white transition-all duration-200";

  return (
    <div className={`${containerStyle} ${className}`}>
      <div className="flex-1 flex items-center gap-2">
        {type === "textarea" ? (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            autoFocus={autoFocus}
            className="w-full bg-transparent text-[#334155] text-[15px] leading-relaxed resize-none outline-none placeholder:text-slate-400"
          />
        ) : (
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full bg-transparent text-[#334155] text-[15px] font-medium outline-none placeholder:text-slate-400"
          />
        )}
        {isMini && showEmojiPicker && (
          <div onMouseDown={(e) => e.preventDefault()}>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} size={16} />
          </div>
        )}
      </div>

      {/* Footer row with character count and emoji picker (only for standard variant) */}
      {!isMini && (showCharCount || showEmojiPicker) && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
          <div className="text-[12px] font-medium text-slate-400">
            {showCharCount && maxLength ? (
              <span>
                {value.length} / {maxLength}
              </span>
            ) : null}
          </div>
          {showEmojiPicker && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <EmojiPicker onEmojiSelect={handleEmojiSelect} size={18} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
