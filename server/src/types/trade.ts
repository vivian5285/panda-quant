import { Document, Types } from 'mongoose';

export interface ITrade {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: 'long' | 'short';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled' | 'failed';
  executedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITradeDocument extends Omit<ITrade, '_id'>, Document {
  _id: Types.ObjectId;
}

export type Trade = ITrade;

export interface TradeCreateInput extends Omit<ITrade, '_id' | 'createdAt' | 'updatedAt'> {}
export interface TradeUpdateInput extends Partial<TradeCreateInput> {} 