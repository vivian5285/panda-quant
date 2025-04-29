import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
export type OrderStatus = 'pending' | 'open' | 'closed' | 'cancelled' | 'failed';

export interface IOrder extends Document {
  _id: string;
  userId: string;
  strategyId: string;
  positionId?: string;
  exchange: string;
  symbol: string;
  orderId: string;
  clientOrderId: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'open' | 'closed' | 'canceled' | 'expired' | 'rejected';
  filledAmount: number;
  averageFillPrice?: number;
  fee: number;
  feeCurrency: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
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