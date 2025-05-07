import mongoose, { Schema, Document } from 'mongoose';

export interface IProfit extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: 'commission' | 'profit';
  status: 'pending' | 'completed' | 'cancelled';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profitSchema = new Schema<IProfit>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['commission', 'profit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

export const Profit = mongoose.model<IProfit>('Profit', profitSchema); 