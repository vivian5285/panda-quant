import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  role: string;
  permissions: string[];
  _id: string;
  email: string;
  password: string;
  referrerId?: string;
}

export interface AuthRequest {
  user?: User;
}

export interface ICommission extends Document {
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLevel extends Document {
  level: number;
  name: string;
  requirements: {
    commission: number;
    trades: number;
  };
  benefits: {
    commissionRate: number;
    withdrawalLimit: number;
  };
}

export interface IBlacklistEntry extends Document {
  userId: string;
  username: string;
  email: string;
  reason: string;
  type: 'spam' | 'fraud' | 'abuse' | 'other';
  status: string;
  expiresAt: Date;
  notes: string;
}

export interface IStrategyRating extends Document {
  strategyId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IWithdrawal extends Document {
  userId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPosition extends Document {
  userId: string;
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionRecord extends Document {
  userId: string;
  referrerId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
} 