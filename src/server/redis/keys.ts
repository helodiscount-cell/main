export const redisKeys = {
  instagram: {
    account: (clerkId: string) => `insta-account:${clerkId}`,
  },
} as const;
