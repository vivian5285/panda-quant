import type { Document, Types } from 'mongoose';
import type { TradeType } from './Enums';

export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
  STOP = 'stop',
  STOP_LIMIT = 'stop_limit'
}

export enum OrderStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum TradeStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  positionId?: Types.ObjectId;
  exchange: string;
  symbol: string;
  orderId: string;
  clientOrderId: string;
  type: OrderType;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
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

export interface ITrade extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  orderId: Types.ObjectId;
  symbol: string;
  type: TradeType;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  status: TradeStatus;
  fee: number;
  feeCurrency: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

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

export type Order = IOrder;
export type Trade = ITrade;

export type OrderCreateInput = Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>;
export type OrderUpdateInput = Partial<OrderCreateInput>;

export type TradeCreateInput = Omit<ITrade, '_id' | 'createdAt' | 'updatedAt'>;
export type TradeUpdateInput = Partial<TradeCreateInput>; 