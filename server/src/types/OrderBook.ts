import { Document, Types } from 'mongoose';

export interface IOrderBook {
  _id: Types.ObjectId;
  exchange: string;
  symbol: string;
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
  timestamp: Date;
}

export interface IOrderBookDocument extends IOrderBook, Document {
  _id: Types.ObjectId;
}

export type OrderBookCreateInput = Omit<IOrderBook, '_id'>;
export type OrderBookUpdateInput = Partial<OrderBookCreateInput>; 