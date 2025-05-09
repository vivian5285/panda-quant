import type { Document } from 'mongoose';
import type { StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus, OrderType, OrderStatus, TradeStatus } from './Enums';
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
import type { IOrder, IOrderBook, IOrderHistory, IOrderCreateInput, IOrderUpdateInput, ITrade, ITradeCreateInput, ITradeUpdateInput } from './Trading';
import type { StrategyPerformance as IStrategyPerformance, PerformanceMetrics as IPerformanceMetrics, PerformanceTrade as IPerformanceTrade, PerformancePeriod as IPerformancePeriod, PerformanceReport as IPerformanceReport, PerformanceChart as IPerformanceChart, PerformanceComparison as IPerformanceComparison } from './Performance';
import type { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from './Exchange';
import type { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from './Mt4';
export type { IUser, IStrategy, ICommission, ICommissionWithdrawal, IAlert, IDeposit, IPosition, IStrategyRating, IBlacklistEntry, IUserLevel, AuthRequest, IOrder, IStrategyPerformance, IPerformanceMetrics, IPerformanceTrade, IPerformancePeriod, IPerformanceReport, IPerformanceChart, IPerformanceComparison, ITrade, IOrderBook, IOrderHistory, IOrderCreateInput, IOrderUpdateInput, ITradeCreateInput, ITradeUpdateInput, IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData, IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData, OrderType, OrderStatus, TradeStatus, AuthenticatedRequest, StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus };
export interface IUserDocument extends Document {
}
export interface IStrategyDocument extends Document {
}
export interface IOrderDocument extends Document {
}
export interface ICommissionDocument extends Document {
}
export interface IStrategyRatingDocument extends Document {
}
export interface IUserLevelDocument extends Document {
}
export interface ICommissionWithdrawalDocument extends Document {
}
export declare enum Network {
    ETHEREUM = "ETHEREUM",
    BITCOIN = "BITCOIN",
    BINANCE = "BINANCE"
}
export interface INetworkStatus {
    network: Network;
    isHealthy: boolean;
    lastChecked: Date;
    error?: string;
}
export interface IOrderWithRetry {
    retryCount: number;
}
export interface IOrderQueue {
    orders: IOrderWithRetry[];
    isProcessing: boolean;
}
export interface IStrategyExecutionResult {
    success: boolean;
    message: string;
    data?: any;
}
export interface IPaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export type { StrategyPerformance, PerformanceMetrics, PerformanceTrade, PerformancePeriod, PerformanceReport, PerformanceChart, PerformanceComparison } from './Performance';
//# sourceMappingURL=index.d.ts.map