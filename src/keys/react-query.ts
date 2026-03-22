export const instagramKeys = {
  all: ["instagram"] as const,
  account: () => [...instagramKeys.all, "account"] as const,
  profile: () => [...instagramKeys.all, "profile"] as const,
  posts: () => [...instagramKeys.all, "posts"] as const,
  stories: () => [...instagramKeys.all, "stories"] as const,
};

export const automationKeys = {
  all: ["automations"] as const,
  list: (filters?: { status?: string }) =>
    [...automationKeys.all, "list", filters] as const,
  create: () => [...automationKeys.all, "create"] as const,
  detail: (id: string) => [...automationKeys.all, "detail", id] as const,
};

export const statsKeys = {
  all: ["stats"] as const,
  outreachImpact: (range: string) =>
    [...statsKeys.all, "outreach-impact", range] as const,
  followersGrowth: (range: string) =>
    [...statsKeys.all, "followers-growth", range] as const,
  bestPerformer: (range: string) =>
    [...statsKeys.all, "best-performer", range] as const,
};

export const formKeys = {
  all: ["forms"] as const,
  list: (filters?: { status?: string }) =>
    [...formKeys.all, "list", filters] as const,
  detail: (id: string) => [...formKeys.all, "detail", id] as const,
  submissions: (id: string) => [...formKeys.all, "submissions", id] as const,
};

export const contactKeys = {
  all: ["contacts"] as const,
  list: (filters?: any) => [...contactKeys.all, "list", filters] as const,
};
