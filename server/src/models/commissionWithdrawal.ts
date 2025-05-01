import { Schema, model } from 'mongoose';
import { ICommissionWithdrawal } from '../types/commissionWithdrawal';

const commissionWithdrawalSchema = new Schema<ICommissionWithdrawal>({
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentDetails: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// 添加索引
commissionWithdrawalSchema.index({ userId: 1 });
commissionWithdrawalSchema.index({ status: 1 });
commissionWithdrawalSchema.index({ createdAt: -1 });

// 在保存前更新 updatedAt
commissionWithdrawalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CommissionWithdrawal = model<ICommissionWithdrawal>('CommissionWithdrawal', commissionWithdrawalSchema); 