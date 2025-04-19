export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginWithWallet: (address: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  updateUsername: (username: string) => Promise<boolean>;
} 