import { useInstagramStore } from "@/store/instagram";

/**
 * Helper functions to work with the Instagram store
 * These can be used outside of React components
 */

// Get the current state (use outside React components)
export function getInstagramState() {
  return useInstagramStore.getState();
}

// Get current account
export function getCurrentAccount() {
  return useInstagramStore.getState().account;
}

// Check if account is connected
export function isAccountConnected() {
  const account = useInstagramStore.getState().account;
  return account !== null && account.connected;
}

// Check if any operation is in progress
export function isAnyOperationInProgress() {
  const state = useInstagramStore.getState();
  return state.isLoading || state.isConnecting || state.isDisconnecting;
}

// Reset the store
export function resetInstagramStore() {
  useInstagramStore.getState().reset();
}

// Set error manually
export function setInstagramError(error: string) {
  useInstagramStore.getState().setError(error);
}

// Clear error manually
export function clearInstagramError() {
  useInstagramStore.getState().clearError();
}
