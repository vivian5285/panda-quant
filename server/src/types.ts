import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: User;
}

export interface User {
  id: string;
  _id: string;
  role: string;
  permissions: string[];
  [key: string]: any;
}

export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
  STOP = 'stop',
  STOP_LIMIT = 'stop_limit'
}

export enum OrderStatus {
  PENDING = 'pending',
  OPEN = 'open',
  FILLED = 'filled',
  PARTIALLY_FILLED = 'partially_filled',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface Order {
  id: string;
  userId: string;
  strategyId: string;
  exchange: string;
  symbol: string;
  type: OrderType;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  status: OrderStatus;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyExecutionResult {
  id: string;
  strategyId: string;
  status: 'success' | 'failed';
  startTime: Date;
  endTime: Date;
  trades: Order[];
  performance: {
    monthlyReturn: number;
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
} 