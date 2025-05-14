export interface IStrategyPerformance {
  strategyId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  trades: number;
  averageTrade: number;
  createdAt: Date;
  updatedAt: Date;
} 