export const instagramKeys = {
  all: ["instagram"] as const,
  account: () => [...instagramKeys.all, "account"] as const,
  profile: () => [...instagramKeys.all, "profile"] as const,
  posts: () => [...instagramKeys.all, "posts"] as const,
};

export const automationKeys = {
  all: ["automations"] as const,
  list: (filters?: { status?: string }) =>
    [...automationKeys.all, "list", filters] as const,
};
