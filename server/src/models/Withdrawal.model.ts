import { Schema, model, Document, Types } from 'mongoose';
import { IWithdrawal } from '../types/Withdrawal';

export interface IWithdrawalDocument extends IWithdrawal, Document {
  _id: Types.ObjectId;
}

const withdrawalSchema = new Schema<IWithdrawalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    network: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    transactionId: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// 添加索引以优化查询
withdrawalSchema.index({ userId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });

export const Withdrawal = model<IWithdrawalDocument>('Withdrawal', withdrawalSchema);
export default Withdrawal; 