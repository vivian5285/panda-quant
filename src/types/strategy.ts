export interface StrategyParams {
  symbol: string;
  amount: number;
  leverage: number;
  maxDrawdown: number;
  userId: string;
}

export interface StrategyResult {
  status: 'success' | 'failed';
  message: string;
  data?: {
    currentReturn?: number;
    maxDrawdown?: number;
    dailyReturn?: number;
    totalTrades?: number;
    winRate?: number;
  };
}

export type StrategyStatus = 'success' | 'failed' | 'running' | 'pending';

export interface StrategyPerformance {
  currentReturn: number;
  maxDrawdown: number;
  dailyReturn: number;
  totalTrades: number;
  winRate: number;
  startDate: Date;
  endDate: Date;
}

export interface StrategyExecutionResult {
  success: boolean;
  message: string;
  trades: Array<{
    symbol: string;
    side: 'buy' | 'sell';
    price: number;
    quantity: number;
    timestamp: Date;
  }>;
  metrics: {
    totalProfit: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
} 