import { StrategyStatus } from './Enums';
import { IPerformance } from './Performance';

export interface BacktestParams {
  exchange: string;
  symbol: string;
  timeframe: string;
  startTime: string;
  endTime: string;
  initialCapital: number;
}

export interface BacktestResult {
  monthlyReturn: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Trade[];
}

export interface Trade {
  timestamp: Date;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  profit: number;
}

export interface IBacktest {
  _id: string;
  strategyId: string;
  status: StrategyStatus;
  config: {
    startDate: Date;
    endDate: Date;
    initialCapital: number;
    symbols: string[];
    timeframe: string;
    parameters: Record<string, any>;
  };
  results: {
    performance: IPerformance;
    trades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IBacktestResult {
  _id: string;
  backtestId: string;
  timestamp: Date;
  equity: number;
  drawdown: number;
  profit: number;
  trades: number;
  metadata?: {
    symbol?: string;
    price?: number;
    volume?: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 