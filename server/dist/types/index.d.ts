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
/// <reference types="@/types/mongoose" />
import { Document } from 'mongoose';
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
import type { IOrder, OrderType, OrderStatus, ITrade, IOrderBook, IOrderHistory, Trade, OrderCreateInput, OrderUpdateInput, TradeCreateInput, TradeUpdateInput } from './Trading';
import type { IStrategyPerformance, IPerformanceMetrics, IPerformanceTrade, IPerformancePeriod, IStrategyPerformanceMetrics, PerformanceMetrics, PerformanceReport, PerformanceTrade, PerformanceChart, PerformanceComparison } from './Performance';
import type { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from './Exchange';
import type { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from './Mt4';
export type { IUser, IStrategy, ICommission, ICommissionWithdrawal, IAlert, IDeposit, IPosition, IStrategyRating, IBlacklistEntry, IUserLevel, AuthRequest, IOrder, IStrategyPerformance, IPerformanceMetrics, IPerformanceTrade, IPerformancePeriod, IStrategyPerformanceMetrics, PerformanceMetrics, PerformanceReport, PerformanceTrade, PerformanceChart, PerformanceComparison, ITrade, IOrderBook, IOrderHistory, Trade, OrderCreateInput, OrderUpdateInput, TradeCreateInput, TradeUpdateInput, IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData, IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData, OrderType, OrderStatus, AuthenticatedRequest };
export type User = IUser & Document;
export type Strategy = IStrategy & Document;
export type Order = IOrder & Document;
export type Commission = ICommission & Document;
export type StrategyRating = IStrategyRating & Document;
export type UserLevel = IUserLevel & Document;
export type CommissionWithdrawal = ICommissionWithdrawal & Document;
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
export type { StrategyType, StrategyStatus, AlertType, RiskLevel, CommissionType, CommissionStatus, WithdrawalStatus } from './Enums';
