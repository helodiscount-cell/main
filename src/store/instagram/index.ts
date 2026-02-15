import { create } from "zustand";

// Types for Instagram account (matches API response)
export interface InstagramAccount {
  connected: boolean;
  username: string;
  profilePictureUrl: string;
  accountType: "BUSINESS" | "CREATOR" | "PERSONAL";
  connectedAt: Date;
  lastSyncedAt: Date | null;
}

// Store state interface
interface InstagramStore {
  // Account data
  account: InstagramAccount | null;

  // Loading states
  isLoading: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;

  // Error state
  error: string | null;

  // Actions
  setAccount: (account: InstagramAccount | null) => void;
  setLoading: (loading: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setDisconnecting: (disconnecting: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  account: null,
  isLoading: false,
  isConnecting: false,
  isDisconnecting: false,
  error: null,
};

// Create the store
export const useInstagramStore = create<InstagramStore>((set) => ({
  // Initial state
  ...initialState,

  // Actions
  setAccount: (account) => {
    set({ account, error: null });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setConnecting: (isConnecting) => {
    set({ isConnecting });
  },

  setDisconnecting: (isDisconnecting) => {
    set({ isDisconnecting });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
