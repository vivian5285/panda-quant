import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'hosting_fee';
  amount: number;
  chain?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'hosting_fee'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  chain: {
    type: String,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  remark: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 