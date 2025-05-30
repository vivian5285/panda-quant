export interface User {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
  role: 'user' | 'admin';
  balance?: number;
  status?: string;
  inviteCode?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
} 