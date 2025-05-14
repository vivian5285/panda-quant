export interface BacktestParams {
  exchange: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  commission: number;
  slippage: number;
}

export interface BacktestResult {
  monthlyReturn: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Array<{
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    position: 'long' | 'short';
    profit: number;
  }>;
} 