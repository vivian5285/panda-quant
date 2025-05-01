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
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface UserFormData {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  createdAt?: string;
} 