import { Document, Types } from 'mongoose';
import { CommissionType, CommissionStatus } from './Enums';

export interface ICommissionBase {
  userId: Types.ObjectId;
  amount: number;
  type: CommissionType;
  status: CommissionStatus;
  description?: string;
  referenceId: Types.ObjectId;
  referenceType: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommission extends ICommissionBase {
  _id: Types.ObjectId;
}

export interface ICommissionDocument extends Omit<ICommission, '_id'>, Document {
  _id: Types.ObjectId;
}

export interface ICommissionRule {
  _id: Types.ObjectId;
  name: string;
  description: string;
  type: CommissionType;
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
  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionWithdrawal {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: CommissionStatus;
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

export type Commission = ICommissionDocument;

export interface CommissionCreateInput extends Omit<ICommissionBase, 'createdAt' | 'updatedAt'> {}

export interface CommissionUpdateInput extends Partial<CommissionCreateInput> {} 