export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  id: string;
  timestamp: number;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  profit?: number;
}

export interface StrategyPreset {
  id: string;
  userId: string;
  name: string;
  params: {
    atrPeriod?: number;
    multiplier?: number;
    trendStrengthFilter?: number;
    positionSize?: number;
    stopLoss?: number;
    takeProfit?: number;
  };
}

export interface StrategyStats {
  totalTrades: number;
  winningTrades: number;
  totalProfit: number;
  minProfit: number;
  maxProfit: number;
  winRate: number;
}

export interface Strategy {
  analyzeMarket(data: OHLCV[]): Promise<'buy' | 'sell' | 'hold'>;
  executeTrade(signal: 'buy' | 'sell', price: number): Promise<void>;
  getStats(): Promise<StrategyStats>;
} 