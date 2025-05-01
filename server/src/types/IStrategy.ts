import { Document, Types } from 'mongoose';

export enum StrategyType {
  MOMENTUM = 'momentum',
  MEAN_REVERSION = 'mean_reversion',
  BREAKOUT = 'breakout',
  SCALPING = 'scalping',
  SWING = 'swing'
}

export enum StrategyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused'
}

export interface IStrategy {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  type: StrategyType;
  parameters: Map<string, any>;
  status: StrategyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyDocument extends IStrategy, Document {} 