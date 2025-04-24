import { Schema, model } from 'mongoose';

export interface ICommissionWithdrawal {
  userId: Schema.Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod: string;
  paymentDetails: {
    accountNumber?: string;
    bankName?: string;
    swiftCode?: string;
    paypalEmail?: string;
    [key: string]: any;
  };
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  notes?: string;
}

const commissionWithdrawalSchema = new Schema<ICommissionWithdrawal>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentDetails: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  notes: String
});

export const CommissionWithdrawal = model<ICommissionWithdrawal>('CommissionWithdrawal', commissionWithdrawalSchema); 