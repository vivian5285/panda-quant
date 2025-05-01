import { Document, Types } from 'mongoose';
import { CommissionType, CommissionStatus } from './enums';

export interface ICommissionBase {
  userId: Types.ObjectId | string;
  amount: number;
  type: CommissionType;
  status: CommissionStatus;
  description?: string;
  referenceId: string;
  referenceType: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommission extends ICommissionBase, Document {}

export interface ICommissionRule {
  _id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  conditions: {
    minVolume?: number;
    maxVolume?: number;
    maxTrades?: number;
    minProfit?: number;
    maxProfit?: number;
    timeframes?: string[];
    pairs?: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionWithdrawal {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  walletAddress: string;
  paymentMethod: 'crypto' | 'bank' | 'paypal';
  paymentDetails: Record<string, any>;
  adminComment?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface ICommissionStats {
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  rejectedCommission: number;
  monthlyStats: {
    month: string;
    commission: number;
    trades: number;
    volume: number;
  }[];
  userStats: {
    userId: string;
    commission: number;
    trades: number;
    volume: number;
  }[];
  referrerStats: {
    referrerId: string;
    commission: number;
    referrals: number;
    volume: number;
  }[];
}

export interface ICommissionPerformance {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  totalProfit: number;
  commissionAmount: number;
}

export type Commission = ICommission;

export interface CommissionCreateInput extends Omit<ICommissionBase, 'createdAt' | 'updatedAt'> {}

export interface CommissionUpdateInput extends Partial<CommissionCreateInput> {} 