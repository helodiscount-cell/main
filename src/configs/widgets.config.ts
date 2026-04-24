const ASK_TO_FOLLOW_CONFIG = {
  TITLE: "Ask to Follow",
  MAX_CHARS: 500,
  DEFAULT_MESSAGE:
    "Oh no! Looks like you haven\u2019t followed me yet \uD83D\uDC40\n\nIt would mean a lot if you could check out my profile and tap that follow button \uD83D\uDE04\n\nOnce you\u2019re done, just click on the \u201cI\u2019m following\u201d button below and I\u2019ll share the link with you \u2728",
} as const;

const OPENING_MESSAGE_CONFIG = {
  TITLE: "Opening Message",
  MAX_CHARS: 500,
  DEFAULT_MESSAGE:
    "Hey there! I\u2019m so happy you\u2019re here, thanks so much for your interest \uD83D\uDE04\n\nClick below and I\u2019ll send you the link in just a sec \u2728",
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
