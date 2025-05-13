import { StrategyStatus } from './Enums';

export interface IPerformance {
  _id: string;
  strategyId: string;
  status: StrategyStatus;
  metrics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    totalProfit: number;
    totalLoss: number;
    netProfit: number;
  };
  period: {
    start: Date;
    end: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPerformanceHistory {
  _id: string;
  strategyId: string;
  timestamp: Date;
  equity: number;
  drawdown: number;
  profit: number;
  trades: number;
  createdAt: Date;
  updatedAt: Date;
} 