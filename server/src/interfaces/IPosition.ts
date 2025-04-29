import { Document } from 'mongoose';

export interface IPosition extends Document {
  _id: string;
  userId: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  status: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
} 