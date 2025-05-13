import { OrderStatus } from './Enums';

export interface IDeposit {
  _id: string;
  userId: string;
  amount: number;
  status: OrderStatus;
  type: 'bank' | 'crypto' | 'other';
  transactionId: string;
  metadata?: {
    bankName?: string;
    accountNumber?: string;
    cryptoAddress?: string;
    cryptoTxId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepositHistory {
  _id: string;
  depositId: string;
  action: 'create' | 'approve' | 'reject' | 'cancel';
  status: OrderStatus;
  amount: number;
  timestamp: Date;
  metadata?: {
    reason?: string;
    adminId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 