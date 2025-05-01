import { Types, Document } from 'mongoose';

export type TradeStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface ITrade {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: TradeStatus;
  metadata: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITradeDocument extends ITrade, Document {
  _id: Types.ObjectId;
} 