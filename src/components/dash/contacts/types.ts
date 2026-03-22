export type Contact = {
  id: string;
  avatarUrl: string;
  username: string;
  type: "Post" | "Reel";
  email: string | null;
  lastInteractedAt: string;
};
