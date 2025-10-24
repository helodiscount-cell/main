// Common API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// User related types
export interface User {
  id: string;
  clerkId: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  clerkId: string;
  fullName: string;
  email: string;
  imageUrl?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  imageUrl?: string;
}

// API endpoints
export const API_ENDPOINTS = {
  USERS: {
    ME: "/users/me",
    ENSURE: "/users/ensure",
    UPDATE: "/users/update",
    DELETE: "/users/delete",
  },
} as const;
