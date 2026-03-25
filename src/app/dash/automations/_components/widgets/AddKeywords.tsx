"use client";

import { X, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useRef, KeyboardEvent } from "react";

type Props = {
  value: string[];
  onChange: (keywords: string[]) => void;
};

const AddKeywords = ({ value: keywords, onChange }: Props) => {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addKeyword = () => {
    const trimmed = input.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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

          <div
            className="flex items-center bg-[#F5F5F5] rounded-lg px-3 py-2.5 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addKeyword}
              placeholder="Type Any Keyword"
              className="flex-1 bg-transparent text-sm text-slate-500 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddKeywords;
