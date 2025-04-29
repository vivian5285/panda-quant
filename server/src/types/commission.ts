import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface ICommission extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid';
  type: 'trade' | 'referral' | 'team';
  level: number;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  reference?: {
    type: string;
    id: Types.ObjectId;
  };
  metadata?: {
    tradeVolume?: number;
    profit?: number;
    teamSize?: number;
    level?: number;
  };
}

export interface ICommissionRule extends Document {
  _id: Types.ObjectId;
  level: number;
  rate: number;
  minVolume: number;
  maxVolume?: number;
  type: 'trade' | 'referral' | 'team';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionWithdrawal extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  paymentDetails?: {
    method: string;
    account: string;
    reference?: string;
  };
}

export interface ICommissionStats {
  totalEarned: number;
  totalPending: number;
  totalPaid: number;
  totalWithdrawn: number;
  totalAvailable: number;
  monthlyStats: {
    month: string;
    earned: number;
    pending: number;
    paid: number;
  }[];
  levelStats: {
    level: number;
    count: number;
    amount: number;
  }[];
  typeStats: {
    type: string;
    count: number;
    amount: number;
  }[];
} 