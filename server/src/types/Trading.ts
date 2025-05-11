import { Document, Types } from 'mongoose';
import { OrderStatus, OrderType, OrderSide, TimeInForce } from './Enums';

export interface IOrderBase {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  status: OrderStatus;
  price: number;
  quantity: number;
  filledQuantity?: number;
  remainingQuantity?: number;
  timeInForce: TimeInForce;
  metadata?: Record<string, any>;
}

export interface IOrder extends IOrderBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
}

export type OrderCreateInput = Omit<IOrderBase, 'status' | 'filledQuantity' | 'remainingQuantity'> & {
  status?: OrderStatus;
  filledQuantity?: number;
  remainingQuantity?: number;
};

export type OrderUpdateInput = Partial<Omit<IOrderBase, 'userId' | 'strategyId' | 'symbol' | 'type' | 'side'>>;

export interface ITradeBase {
  strategyId: Types.ObjectId;
  orderId: Types.ObjectId;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  leverage: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  pnl?: number;
  pnlPercentage?: number;
  entryTime: Date;
  exitTime?: Date;
  stopLoss?: number;
  takeProfit?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrade extends ITradeBase, Document {}

export type Trade = ITrade;

export type ITradeDocument = ITrade;
export type TradeDocument = Trade;

export interface IOrderBookBase {
  symbol: string;
  bids: Array<[number, number]>; // [price, quantity]
  asks: Array<[number, number]>; // [price, quantity]
  timestamp: Date;
}

export type OrderBookBase = IOrderBookBase;

export interface IOrderBook extends Document, IOrderBookBase {}

export type OrderBook = IOrderBook;

export type IOrderBookDocument = IOrderBook;
export type OrderBookDocument = OrderBook;

export interface IOrderHistoryBase {
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

export type OrderHistoryBase = IOrderHistoryBase;

export interface IOrderHistory extends Document, IOrderHistoryBase {}

export type OrderHistory = IOrderHistory;

export type IOrderHistoryDocument = IOrderHistory;
export type OrderHistoryDocument = OrderHistory;

export type ITradeCreateInput = Omit<ITradeBase, 'createdAt' | 'updatedAt'>;
export type TradeCreateInput = ITradeCreateInput;

export type ITradeUpdateInput = Partial<ITradeCreateInput>;
export type TradeUpdateInput = ITradeUpdateInput; 