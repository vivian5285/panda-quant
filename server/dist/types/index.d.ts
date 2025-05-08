import type { Document } from 'mongoose';
import type { StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus, OrderType, OrderStatus, TradeStatus } from './Enums';
import type { User } from './User';
import type { Strategy } from './Strategy';
import type { Commission } from './Commission';
import type { ICommissionWithdrawal } from './CommissionWithdrawal';
import type { Alert } from './Alert';
import type { Deposit } from './Deposit';
import type { Position } from './Position';
import type { IStrategyRating } from './StrategyRating';
import type { IBlacklistEntry } from './Blacklist';
import type { IUserLevel } from './UserLevel';
import type { AuthRequest, AuthenticatedRequest } from './Auth';
import type { Order, OrderBook, OrderHistory, OrderCreateInput, OrderUpdateInput, Trade, TradeCreateInput, TradeUpdateInput } from './Trading';
import type { StrategyPerformance, PerformanceMetrics, PerformanceTrade, PerformancePeriod, PerformanceReport, PerformanceChart, PerformanceComparison } from './Performance';
import type { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from './Exchange';
import type { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from './Mt4';
export type { User, Strategy, Commission, ICommissionWithdrawal, Alert, Deposit, Position, IStrategyRating, IBlacklistEntry, IUserLevel, AuthRequest, Order, StrategyPerformance, PerformanceMetrics, PerformanceTrade, PerformancePeriod, PerformanceReport, PerformanceChart, PerformanceComparison, Trade, OrderBook, OrderHistory, OrderCreateInput, OrderUpdateInput, TradeCreateInput, TradeUpdateInput, IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData, IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData, OrderType, OrderStatus, TradeStatus, AuthenticatedRequest, StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus };
export interface UserDocument extends Document {
}
export interface StrategyDocument extends Document {
}
export interface OrderDocument extends Document {
}
export interface CommissionDocument extends Document {
}
export interface StrategyRatingDocument extends Document {
}
export interface UserLevelDocument extends Document {
}
export interface CommissionWithdrawalDocument extends Document {
}
export declare enum Network {
    ETHEREUM = "ETHEREUM",
    BITCOIN = "BITCOIN",
    BINANCE = "BINANCE"
}
export interface NetworkStatus {
    network: Network;
    isHealthy: boolean;
    lastChecked: Date;
    error?: string;
}
export interface OrderWithRetry {
    retryCount: number;
}
export interface OrderQueue {
    orders: OrderWithRetry[];
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
//# sourceMappingURL=index.d.ts.map