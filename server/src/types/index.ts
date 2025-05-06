import { Request } from 'express';
import { Document } from 'mongoose';
import type {
  StrategyType,
  StrategyStatus,
  AlertType,
  RiskLevel,
  CommissionType,
  CommissionStatus,
  WithdrawalStatus
} from './Enums';
import type { IUser } from './User';
import type { IStrategy } from './Strategy';
import type { ICommission } from './Commission';
import type { ICommissionWithdrawal } from './CommissionWithdrawal';
import type { IAlert } from './Alert';
import type { IDeposit } from './Deposit';
import type { IPosition } from './Position';
import type { IStrategyRating } from './StrategyRating';
import type { IBlacklistEntry } from './Blacklist';
import type { IUserLevel } from './UserLevel';
import type { AuthRequest, AuthenticatedRequest } from './Auth';
import type { 
  IOrder, 
  OrderType, 
  OrderStatus,
  ITrade,
  IOrderBook,
  IOrderHistory,
  Trade,
  OrderCreateInput,
  OrderUpdateInput,
  TradeCreateInput,
  TradeUpdateInput
} from './Trading';
import type { 
  IStrategyPerformance, 
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
import type { 
  IExchangeCredentials, 
  IExchangeBalance, 
  IExchangeOrder, 
  IExchangePosition, 
  IExchangeTrade, 
  IExchangeMarketData 
} from './Exchange';
import type { 
  IMT4Account, 
  IMT4Position, 
  IMT4Order, 
  IMT4Balance, 
  IMT4MarketData 
} from './Mt4';

// Export all interface types
export type {
  IUser,
  IStrategy,
  ICommission,
  ICommissionWithdrawal,
  IAlert,
  IDeposit,
  IPosition,
  IStrategyRating,
  IBlacklistEntry,
  IUserLevel,
  AuthRequest,
  IOrder,
  IStrategyPerformance,
  IPerformanceMetrics,
  IPerformanceTrade,
  IPerformancePeriod,
  IStrategyPerformanceMetrics,
  PerformanceMetrics,
  PerformanceReport,
  PerformanceTrade,
  PerformanceChart,
  PerformanceComparison,
  ITrade,
  IOrderBook,
  IOrderHistory,
  Trade,
  OrderCreateInput,
  OrderUpdateInput,
  TradeCreateInput,
  TradeUpdateInput,
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
  IMT4MarketData,
  OrderType,
  OrderStatus,
  AuthenticatedRequest,
  StrategyType,
  StrategyStatus,
  AlertType,
  RiskLevel,
  CommissionType,
  CommissionStatus,
  WithdrawalStatus
};

// Base types
export type User = IUser & Document;
export type Strategy = IStrategy & Document;
export type Order = IOrder & Document;
export type Commission = ICommission & Document;
export type StrategyRating = IStrategyRating & Document;
export type UserLevel = IUserLevel & Document;
export type CommissionWithdrawal = ICommissionWithdrawal & Document;

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 