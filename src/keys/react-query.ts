export const instagramKeys = {
  all: ["instagram"] as const,
  account: () => [...instagramKeys.all, "account"] as const,
  profile: () => [...instagramKeys.all, "profile"] as const,
  posts: () => [...instagramKeys.all, "posts"] as const,
};
