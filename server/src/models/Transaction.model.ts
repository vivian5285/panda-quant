import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  fee: number;
  feeCurrency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  orderId: string;
  exchange: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  fee: number;
  feeCurrency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  orderId: string;
  exchange: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransactionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  fee: { type: Number, required: true },
  feeCurrency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], required: true },
  orderId: { type: String, required: true },
  exchange: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

transactionSchema.index({ userId: 1 });
transactionSchema.index({ strategyId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ symbol: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ exchange: 1 });
transactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model<ITransactionDocument>('Transaction', transactionSchema); 