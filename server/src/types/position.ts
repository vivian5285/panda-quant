import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { IPosition } from '../interfaces/IPosition';

export interface IPosition extends Document {
  _id: string;
  userId: string;
  strategyId: string;
  exchange: string;
  symbol: string;
  side: 'long' | 'short';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  leverage: number;
  margin: number;
  liquidationPrice: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface IPositionHistory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  positions: {
    positionId: Types.ObjectId;
    symbol: string;
    side: string;
    status: string;
    quantity: number;
    entryPrice: number;
    exitPrice?: number;
    unrealizedPnl?: number;
    realizedPnl?: number;
    leverage: number;
    margin: number;
    stopLoss?: number;
    takeProfit?: number;
    createdAt: Date;
    closedAt?: Date;
  }[];
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalPositions: number;
    openPositions: number;
    closedPositions: number;
    totalVolume: number;
    totalPnl: number;
    winRate: number;
    averageHoldingTime: number;
    maxDrawdown: number;
    profitFactor: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPositionStats {
  totalPositions: number;
  openPositions: number;
  closedPositions: number;
  totalVolume: number;
  totalPnl: number;
  winRate: number;
  averageHoldingTime: number;
  maxDrawdown: number;
  profitFactor: number;
  monthlyStats: {
    month: string;
    positions: number;
    volume: number;
    pnl: number;
  }[];
  symbolStats: {
    symbol: string;
    positions: number;
    volume: number;
    pnl: number;
  }[];
  strategyStats: {
    strategyId: Types.ObjectId;
    positions: number;
    volume: number;
    pnl: number;
  }[];
}

export type Position = IPosition;

export interface PositionCreateInput extends Omit<IPosition, '_id' | 'createdAt' | 'updatedAt'> {}
export interface PositionUpdateInput extends Partial<PositionCreateInput> {} 