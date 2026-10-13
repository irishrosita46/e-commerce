export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  sessionToken?: string;
  expiresAt?: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
