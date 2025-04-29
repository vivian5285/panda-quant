import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  status: 'open' | 'filled' | 'canceled' | 'rejected';
  quantity: number;
  price?: number;
  stopPrice?: number;
  limitPrice?: number;
  filledQuantity?: number;
  averageFillPrice?: number;
  commission?: number;
  createdAt: Date;
  updatedAt: Date;
  filledAt?: Date;
  canceledAt?: Date;
  metadata?: {
    exchange?: string;
    orderId?: string;
    clientOrderId?: string;
    timeInForce?: string;
    iceberg?: boolean;
    postOnly?: boolean;
    reduceOnly?: boolean;
    closePosition?: boolean;
    activationPrice?: number;
    callbackRate?: number;
    workingType?: string;
    priceProtect?: boolean;
  };
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