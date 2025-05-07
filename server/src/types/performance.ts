import type { Document, Types } from 'mongoose';

export interface IPerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageTradeDuration: number;
  totalProfit: number;
  totalLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  monthlyReturns: number[];
  dailyReturns: number[];
}

export interface IPerformanceTrade {
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  size: number;
  profit: number;
  type: 'long' | 'short';
  status: 'win' | 'loss';
}

export interface IPerformancePeriod {
  start: Date;
  end: Date;
}

export interface IStrategyPerformance extends Document {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  period: IPerformancePeriod;
  metrics: IPerformanceMetrics;
  trades: IPerformanceTrade[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyPerformanceMetrics {
  totalProfit: number;
  totalLoss: number;
  winRate: number;
  averageProfit: number;
  averageLoss: number;
}

export interface IPerformanceReport {
  userId: Types.ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: IPerformanceMetrics;
  trades: IPerformanceTrade[];
  deposits: number;
  withdrawals: number;
  netDeposits: number;
  roi: number;
}

export interface IPerformanceChart {
  userId: Types.ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: {
    date: Date;
    equity: number;
    balance: number;
    profit: number;
    drawdown: number;
  }[];
}

export interface IPerformanceComparison {
  userId: Types.ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  strategies: {
    strategyId: Types.ObjectId;
    name: string;
    metrics: IPerformanceMetrics;
  }[];
}

export type PerformanceReport = IPerformanceReport;
export type PerformanceChart = IPerformanceChart;
export type PerformanceComparison = IPerformanceComparison; 