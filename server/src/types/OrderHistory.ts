import { Types } from 'mongoose';

export interface IOrderHistory {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  orderId: string;
  symbol: string;
  type: string;
  side: string;
  amount: number;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderHistoryDocument extends IOrderHistory {
  save(): Promise<IOrderHistoryDocument>;
} 