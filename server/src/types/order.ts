import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  userId: string;
  strategyId: string;
  symbol: string;
  type: 'buy' | 'sell';
  status: 'pending' | 'filled' | 'cancelled';
  price: number;
  quantity: number;
  executedPrice?: number;
  executedQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Order = IOrder;

export interface OrderCreateInput extends Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'> {}
export interface OrderUpdateInput extends Partial<OrderCreateInput> {}

export interface IOrderBook extends Document {
  _id: Types.ObjectId;
  symbol: string;
  bids: {
    price: number;
    quantity: number;
  }[];
  asks: {
    price: number;
    quantity: number;
  }[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderHistory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  orders: {
    orderId: Types.ObjectId;
    symbol: string;
    type: string;
    side: string;
    status: string;
    quantity: number;
    price?: number;
    filledQuantity?: number;
    averageFillPrice?: number;
    commission?: number;
    createdAt: Date;
    filledAt?: Date;
    canceledAt?: Date;
  }[];
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalOrders: number;
    filledOrders: number;
    canceledOrders: number;
    totalVolume: number;
    totalCommission: number;
    averageFillPrice: number;
    winRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 