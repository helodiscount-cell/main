export {};

declare global {
  interface UserPublicMetadata {
    isConnected?: boolean;
    instaUsername?: string;
    instaProfilePictureUrl?: string;
    instaUserId?: string;
    instaAccountType?: string;
    lastSync?: string;
  }
}
