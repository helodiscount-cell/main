const ASK_TO_FOLLOW_CONFIG = {
  TITLE: "Ask to Follow",
  DEFAULT_MESSAGE:
    "Oh no! Looks like you haven’t followed me yet 👀\n\nIt would mean a lot if you could check out my profile and tap that follow button 😄\n\nOnce you’re done, just click on the “I’m following” button below and I’ll share the link with you ✨",
} as const;

const OPENING_MESSAGE_CONFIG = {
  TITLE: "Opening Message",
  DEFAULT_MESSAGE:
    "Hey there! I'm so happy you're here, thanks so much for your interest 😄\n\nClick below and I'll send you the link in just a sec ✨",
  DEFAULT_BUTTON_TEXT: "Send me the link",
  COLORS: {
    PRIMARY: "#6A06E4",
    SECONDARY: "#F5F5F5",
    BORDER: "#D8B4FE", // purple-300
    TEXT_MAIN: "#1E293B", // slate-800
    TEXT_MUTED: "#64748B", // slate-500
  },
} as const;

export { ASK_TO_FOLLOW_CONFIG, OPENING_MESSAGE_CONFIG };
