import { Document, Types } from 'mongoose';
import { OrderStatus, OrderType, TradeType } from './Enums';

export interface IOrderBase {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: OrderType;
  side: TradeType;
  quantity: number;
  price: number;
  status: OrderStatus;
  filledQuantity: number;
  averagePrice: number;
  commission: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: OrderType;
  side: TradeType;
  quantity: number;
  price: number;
  status: OrderStatus;
  filledQuantity: number;
  averagePrice: number;
  commission: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrderBase, Document {
  _id: Types.ObjectId;
}

export interface OrderCreateInput extends Omit<IOrderBase, 'createdAt' | 'updatedAt'> {}
export interface OrderUpdateInput extends Partial<OrderCreateInput> {} 