import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from './user';
import { IStrategy } from './strategy';
import { ICommission } from './commission';
import { ICommissionWithdrawal } from './commissionWithdrawal';
import { IAlert } from './alert';
import { IDeposit } from './deposit';
import { IPosition } from './position';
import { IStrategyRating } from './strategyRating';
import { IBlacklistEntry } from './blacklist';
import { IUserLevel } from './userLevel';
import { AuthRequest as IAuthRequest } from './auth';
import { IOrder, OrderType, OrderStatus } from './trading';
import { IStrategyPerformance } from './performance';
import { INotification } from './notification';
import { IApiResponse, IApiError, IApiRequest } from './api';
import { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from './exchange';
import { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from './mt4';

// Base types
export type User = IUser & Document;
export type Strategy = IStrategy & Document;
export type Order = IOrder & Document;
export type Commission = ICommission & Document;
export type StrategyRating = IStrategyRating & Document;
export type UserLevel = IUserLevel & Document;
export type CommissionWithdrawal = ICommissionWithdrawal & Document;
export type Notification = INotification & Document;

// Enums
export enum Network {
  ETHEREUM = 'ETHEREUM',
  BITCOIN = 'BITCOIN',
  BINANCE = 'BINANCE'
}

// Interfaces
export interface INetworkStatus {
  network: Network;
  isHealthy: boolean;
  lastChecked: Date;
  error?: string;
}

export interface IOrderWithRetry extends IOrder {
  retryCount: number;
}

export interface IOrderQueue {
  orders: IOrderWithRetry[];
  isProcessing: boolean;
}

export interface StrategyExecutionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Re-exports
export {
  IAuthRequest,
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
  INotification,
  IApiResponse,
  IApiError,
  IApiRequest,
  IExchangeCredentials,
  IExchangeBalance,
  IExchangeOrder,
  IExchangePosition,
  IExchangeTrade,
  IExchangeMarketData,
  IMT4Account,
  IMT4Position,
  IMT4Order,
  IMT4Balance,
  IMT4MarketData
};

// Performance types
export {
  IPerformanceMetrics,
  IPerformanceTrade,
  IPerformancePeriod,
  IStrategyPerformanceMetrics,
  PerformanceMetrics,
  PerformanceReport,
  PerformanceTrade,
  PerformanceChart,
  PerformanceComparison
} from './performance';

// Trading types
export {
  TradeType,
  TradeStatus,
  ITrade,
  IOrderBook,
  IOrderHistory,
  Trade,
  OrderCreateInput,
  OrderUpdateInput,
  TradeCreateInput,
  TradeUpdateInput
} from './trading';

// Enum types
export {
  StrategyType,
  StrategyStatus,
  AlertType,
  RiskLevel,
  CommissionType,
  CommissionStatus,
  WithdrawalStatus
} from './enums';

// Other types
export * from './transaction';
export * from './withdrawal';
export * from './settlement';
export * from './notification';
export * from './risk';
export * from './network';
export * from './backtest';
export * from './express.d'; 