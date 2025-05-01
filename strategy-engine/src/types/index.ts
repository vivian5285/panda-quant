import { Types } from 'mongoose';

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price?: number;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

export interface IStrategy {
  _id: Types.ObjectId;
  name: string;
  description: string;
  userId: Types.ObjectId;
  parameters: Record<string, any>;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyExecutionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  referrerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyPerformance {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  profit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommission {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INetworkStatus {
  _id: Types.ObjectId;
  network: string;
  type: 'database' | 'api' | 'redis' | 'websocket';
  status: 'online' | 'offline' | 'checking' | 'error';
  lastChecked: Date;
  responseTime: number;
  blockHeight?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlert {
  _id: Types.ObjectId;
  userId: string;
  type: 'price' | 'volume' | 'technical';
  condition: string;
  value: number;
  status: 'active' | 'triggered' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlacklistEntry {
  _id: Types.ObjectId;
  type: string;
  value: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLevel {
  _id: Types.ObjectId;
  name: string;
  description: string;
  requirements: Record<string, any>;
  benefits: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 