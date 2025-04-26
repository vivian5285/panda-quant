import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema); 