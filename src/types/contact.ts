export type Contact = {
  id: string;
  avatarUrl: string;
  username: string;
  type: "Post" | "Reel" | "Story";
  email: string | null;
  lastInteractedAt: string;
};
