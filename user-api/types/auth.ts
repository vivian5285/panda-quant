import { Request, Response } from 'express';

export interface AuthUser {
  id: string;
  _id: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  name: string;
  balance: number;
  hostingFee: number;
  subscriptionFee: number;
  accountBalance: number;
  subscriptionEndDate: Date | null;
  status: 'active' | 'inactive' | 'suspended';
  referralCode: string;
  referralRewards: number;
  referredBy?: string;
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  totalDeposits: number;
  depositAddresses: Array<{
    chain: string;
    address: string;
  }>;
  walletAddress?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface AuthResponse extends Response {
  status(code: number): this;
  json(body: any): this;
} 