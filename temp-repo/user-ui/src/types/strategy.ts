export interface StrategyStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'quantitative' | 'technical' | 'fundamental';
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface StrategyConfig {
  initialCapital: number;
  riskPerTrade: number;
  maxDrawdown: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
}

export interface BacktestConfig {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  config: StrategyConfig;
}

export interface BacktestResult {
  equityCurve: Array<{ timestamp: number; value: number }>;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Array<{
    timestamp: number;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    profit?: number;
  }>;
} 