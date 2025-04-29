import { Schema, model, Types } from 'mongoose';

export interface IOrder {
  userId: Types.ObjectId;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Order = model<IOrder>('Order', orderSchema); 