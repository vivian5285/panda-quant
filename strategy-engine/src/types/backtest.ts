export interface BacktestParams {
  strategyId: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  parameters: Record<string, any>;
}

export interface BacktestResult {
  id: string;
  strategyId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  totalProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Array<{
    entryDate: Date;
    exitDate: Date;
    entryPrice: number;
    exitPrice: number;
    profit: number;
    type: 'long' | 'short';
  }>;
  equity: Array<{
    date: Date;
    value: number;
  }>;
  parameters: Record<string, any>;
  period: {
    start: Date;
    end: Date;
  };
} 