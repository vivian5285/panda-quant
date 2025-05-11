import { Document, Types } from 'mongoose';
import { TradeStatus, TradeType } from './Enums';

export interface ITrade {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: TradeType;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  status: TradeStatus;
  profit?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITradeDocument extends Omit<Document, '_id'>, ITrade {
  _id: Types.ObjectId;
}

export type TradeCreateInput = Omit<ITrade, '_id' | 'createdAt' | 'updatedAt'>;
export type TradeUpdateInput = Partial<Omit<ITrade, '_id' | 'createdAt' | 'updatedAt'>>; 