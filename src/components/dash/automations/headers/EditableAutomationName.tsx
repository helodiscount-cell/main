"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";

interface EditableAutomationNameProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: (val: string) => void;
  className?: string;
}

/**
 * A reusable component that allows users to click to edit a name.
 * Switches between a display span and an input field.
 */
export function EditableAutomationName({
  value,
  onChange,
  onSave,
  className = "",
}: EditableAutomationNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (internalValue !== value) {
      onChange(internalValue);
      onSave?.(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setInternalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-none outline-none font-bold text-slate-900 min-w-[50px] w-fit ${className}`}
        style={{ width: `${Math.max(internalValue.length, 5)}ch` }}
      />
    );
  }

  const displayValue = value || "/undefined";
  const isUndefined = !value;

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer group inline-flex items-center gap-1.5 hover:text-purple-600 transition-colors ${
        isUndefined
          ? "text-red-400 font-medium italic"
          : "text-slate-900 font-bold"
      } ${className}`}
    >
      {displayValue}
      <Edit2
        size={12}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"
      />
    </span>
  );
}
