export interface UserLevel {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  requirements: {
    minBalance: number;
    minTradingVolume: number;
    minHoldingTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlacklistEntry {
  id: string;
  userId: string;
  username: string;
  email: string;
  reason: string;
  type: 'spam' | 'fraud' | 'abuse' | 'other';
  status: 'active' | 'expired';
  createdAt: string;
  expiresAt?: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'user' | 'admin' | 'moderator';
  level: UserLevel;
  createdAt: string;
  lastLogin: string;
  avatar?: string;
} 