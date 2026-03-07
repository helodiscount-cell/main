export interface CreateUserData {
  clerkId: string;
  fullName?: string;
  email?: string;
  imageUrl?: string | null;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  imageUrl?: string | null;
}
