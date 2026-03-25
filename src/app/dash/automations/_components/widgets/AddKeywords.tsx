"use client";

import { X, ChevronUp, ChevronDown } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { AutomationInput } from "./AutomationInput";

type Props = {
  value: string[];
  onChange: (keywords: string[]) => void;
};

const AddKeywords = ({ value: keywords, onChange }: Props) => {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const addKeyword = () => {
    const trimmed = input.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    } else if (e.key === "Backspace" && input === "" && keywords.length > 0) {
      removeKeyword(keywords.length - 1);
    }
  };

  const removeKeyword = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      onChange(keywords.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 200);
  };

  return (
    <div className="bg-white rounded-xl border border-purple-300 overflow-hidden w-full">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-semibold text-slate-800">
          Setup Keywords
        </span>
        {open ? (
          <ChevronUp size={16} className="text-slate-500" />
        ) : (
          <ChevronDown size={16} className="text-slate-500" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span
                  key={kw}
                  onClick={() => removeKeyword(i)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium cursor-pointer select-none transition-all duration-200"
                  style={{
                    opacity: removingIndex === i ? 0 : 1,
                    transform: removingIndex === i ? "scale(0.8)" : "scale(1)",
                  }}
                >
                  {kw}
                  <X size={11} className="text-purple-400" />
                </span>
              ))}
            </div>
          )}

          <AutomationInput
            type="input"
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            onBlur={addKeyword}
            placeholder="Type Any Keyword"
            showEmojiPicker={false}
            showCharCount={false}
          />
        </div>
      )}
    </div>
  );
};

export default AddKeywords;
