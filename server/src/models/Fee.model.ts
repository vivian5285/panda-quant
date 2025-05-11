import { Schema, model, Document } from 'mongoose';

export interface IFee extends Document {
    userId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const feeSchema = new Schema<IFee>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Fee = model<IFee>('Fee', feeSchema); 