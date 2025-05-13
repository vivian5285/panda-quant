import { OrderStatus } from './Enums';

export interface ITrade {
  _id: string;
  strategyId: string;
  orderId: string;
  symbol: string;
  type: 'buy' | 'sell';
  status: OrderStatus;
  price: number;
  quantity: number;
  total: number;
  fee: number;
  timestamp: Date;
  metadata?: {
    stopLoss?: number;
    takeProfit?: number;
    trailingStop?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ITradeHistory {
  _id: string;
  tradeId: string;
  action: 'open' | 'close' | 'modify';
  price: number;
  quantity: number;
  timestamp: Date;
  metadata?: {
    reason?: string;
    stopLoss?: number;
    takeProfit?: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 