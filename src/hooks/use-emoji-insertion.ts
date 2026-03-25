import { useRef } from "react";

/**
 * A reusable hook to handle inserting an emoji into a text field at the cursor position.
 * @param value Current state value of the input
 * @param onChange State setter for the input
 * @param maxLength Optional character limit
 */
export function useEmojiInsertion<
  T extends HTMLTextAreaElement | HTMLInputElement,
>(value: string, onChange: (val: string) => void, maxLength?: number) {
  const ref = useRef<T>(null);

  const handleEmojiSelect = (emoji: string) => {
    const input = ref.current;
    if (!input) {
      // If no ref is active, just append at the end
      const newText = value + emoji;
      onChange(maxLength ? newText.slice(0, maxLength) : newText);
      return;
    }

    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const newText = value.substring(0, start) + emoji + value.substring(end);

    onChange(maxLength ? newText.slice(0, maxLength) : newText);

    // After state update, we focus back and reposition the cursor
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return { ref, handleEmojiSelect };
}
