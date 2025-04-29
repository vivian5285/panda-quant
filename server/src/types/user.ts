import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  };
  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
    language?: string;
    timezone?: string;
  };
  verification?: {
    email?: boolean;
    phone?: boolean;
    twoFactor?: boolean;
  };
  security?: {
    twoFactorEnabled?: boolean;
    lastPasswordChange?: Date;
    failedLoginAttempts?: number;
    lastFailedLogin?: Date;
  };
  level?: {
    current?: string;
    points?: number;
    nextLevel?: string;
    progress?: number;
  };
  commission?: {
    rate?: number;
    totalEarned?: number;
    pending?: number;
    paid?: number;
  };
  team?: {
    members?: string[];
    leader?: string;
    level?: string;
  };
  trading?: {
    balance?: number;
    totalDeposits?: number;
    totalWithdrawals?: number;
    totalTrades?: number;
    winRate?: number;
    profitFactor?: number;
    averageTradeDuration?: number;
    lastTradeDate?: Date;
  };
  documents?: {
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: Date;
  }[];
  preferences?: {
    theme?: string;
    notifications?: {
      trade?: boolean;
      deposit?: boolean;
      withdrawal?: boolean;
      commission?: boolean;
    };
  };
  metadata?: {
    ip?: string;
    device?: string;
    browser?: string;
    lastActive?: Date;
  };
} 