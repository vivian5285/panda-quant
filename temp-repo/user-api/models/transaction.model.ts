import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'hosting_fee' | 'commission';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: Date;
}

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'hosting_fee', 'commission'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 添加索引以提高查询性能
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: 1 });

// 导出 Transaction 模型
export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema); 