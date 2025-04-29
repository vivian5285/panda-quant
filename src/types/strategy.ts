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