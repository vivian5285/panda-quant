import mongoose, { Schema } from 'mongoose';
import { IDeposit, IDepositDocument } from '../types/Deposit';

const depositSchema = new Schema<IDepositDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String },
  network: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 添加中间件来自动更新updatedAt字段
depositSchema.pre('save', function(this: IDepositDocument, next) {
  this.updatedAt = new Date();
  next();
});

export const Deposit = mongoose.model<IDepositDocument>('Deposit', depositSchema); 