export type Contact = {
  type: "contact";
  id: string;
  avatarUrl: string;
  username: string;
  kind: "Post" | "Reel" | "Story";
  email: string | null;
  lastInteractedAt: string;
};
