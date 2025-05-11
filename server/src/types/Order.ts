import { Document, Types } from 'mongoose';
import { OrderStatus, OrderType, TradeType } from './Enums';

export interface IOrderBase {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: string;
  side: string;
  amount: number;
  price: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends IOrderBase {
  _id: Types.ObjectId;
  orderId: string;
}

export interface IOrderDocument extends Omit<Document, '_id'>, IOrder {}

export type OrderCreateInput = Omit<IOrderBase, 'createdAt' | 'updatedAt'>;
export type OrderUpdateInput = Partial<Omit<IOrderBase, 'createdAt' | 'updatedAt'>>; 