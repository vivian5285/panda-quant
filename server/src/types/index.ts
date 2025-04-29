import { Request } from 'express';
import { User } from './user';
import { IUser } from './user';
import { IStrategy } from './strategy';
import { IOrder, OrderType, OrderStatus } from './order';
import { IStrategyPerformance } from './strategyPerformance';
import { ICommission } from './commission';
import { ICommissionWithdrawal } from './commissionWithdrawal';
import { IAlert } from './alert';
import { IDeposit } from './deposit';
import { IPosition } from './position';
import { IStrategyRating } from './strategyRating';
import { IBlacklistEntry } from './blacklist';
import { IUserLevel } from './userLevel';
import { IAuthRequest } from './auth';

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

export * from './auth';
export * from './deposit';
export * from './user';
export * from './commission';
export * from './withdrawal';
export * from './strategy';
export * from './order';
export * from './position';
export * from './alert';
export * from './notification';
export * from './network';

export {
  IUser,
  IStrategy,
  IOrder,
  OrderType,
  OrderStatus,
  IStrategyPerformance,
  ICommission,
  ICommissionWithdrawal,
  IAlert,
  IDeposit,
  IPosition,
  IStrategyRating,
  IBlacklistEntry,
  IUserLevel,
  IAuthRequest
}; 