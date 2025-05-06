import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from './User';
import { IStrategy } from './Strategy';
import { ICommission } from './Commission';
import { ICommissionWithdrawal } from './CommissionWithdrawal';
import { IAlert } from './Alert';
import { IDeposit } from './Deposit';
import { IPosition } from './Position';
import { IStrategyRating } from './StrategyRating';
import { IBlacklistEntry } from './Blacklist';
import { IUserLevel } from './UserLevel';
import { AuthRequest as IAuthRequest } from './Auth';
import { IOrder, OrderType, OrderStatus } from './Trading';
import { IStrategyPerformance } from './Performance';
import { INotification } from './Notification';
import { IApiResponse, IApiError, IApiRequest } from './Api';
import { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from './Exchange';
import { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from './Mt4';

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
} from './Performance';

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
} from './Trading';

// Enum types
export {
  StrategyType,
  StrategyStatus,
  AlertType,
  RiskLevel,
  CommissionType,
  CommissionStatus,
  WithdrawalStatus
} from './Enums';

// Other types
export * from './Transaction';
export * from './Withdrawal';
export * from './Settlement';
export * from './Notification';
export * from './Risk';
export * from './Network';
export * from './Backtest';
export { AuthenticatedRequest } from './express';

export * from './User';
export * from './Auth';
export * from './Commission';
export * from './Strategy'; 