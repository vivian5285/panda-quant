/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import type { Document } from 'mongoose';
import type { StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus } from './Enums';
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
import type { IOrder, OrderType, OrderStatus, ITrade, IOrderBook, IOrderHistory, OrderCreateInput, OrderUpdateInput, TradeCreateInput, TradeUpdateInput } from './Trading';
import type { IStrategyPerformance, IPerformanceMetrics, IPerformanceTrade, IPerformancePeriod, IStrategyPerformanceMetrics, IPerformanceReport, IPerformanceChart, IPerformanceComparison } from './Performance';
import type { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from './Exchange';
import type { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from './Mt4';
export type { User, Strategy, Commission, ICommissionWithdrawal as CommissionWithdrawal, Alert, Deposit, Position, IStrategyRating as StrategyRating, IBlacklistEntry as BlacklistEntry, IUserLevel as UserLevel, AuthRequest, IOrder as Order, IStrategyPerformance as StrategyPerformance, IPerformanceMetrics as PerformanceMetrics, IPerformanceTrade as PerformanceTrade, IPerformancePeriod as PerformancePeriod, IStrategyPerformanceMetrics as StrategyPerformanceMetrics, IPerformanceReport as PerformanceReport, IPerformanceChart as PerformanceChart, IPerformanceComparison as PerformanceComparison, ITrade as Trade, IOrderBook as OrderBook, IOrderHistory as OrderHistory, ITrade, OrderCreateInput, OrderUpdateInput, TradeCreateInput, TradeUpdateInput, IExchangeCredentials as ExchangeCredentials, IExchangeBalance as ExchangeBalance, IExchangeOrder as ExchangeOrder, IExchangePosition as ExchangePosition, IExchangeTrade as ExchangeTrade, IExchangeMarketData as ExchangeMarketData, IMT4Account as MT4Account, IMT4Position as MT4Position, IMT4Order as MT4Order, IMT4Balance as MT4Balance, IMT4MarketData as MT4MarketData, OrderType, OrderStatus, AuthenticatedRequest, StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus };
export type UserDocument = User & Document;
export type StrategyDocument = Strategy & Document;
export type OrderDocument = IOrder & Document;
export type CommissionDocument = Commission & Document;
export type StrategyRatingDocument = IStrategyRating & Document;
export type UserLevelDocument = IUserLevel & Document;
export type CommissionWithdrawalDocument = ICommissionWithdrawal & Document;
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
export interface OrderWithRetry extends IOrder {
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
//# sourceMappingURL=Index.d.ts.map