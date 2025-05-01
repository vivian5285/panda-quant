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
  type: string;
  status: 'active' | 'paused' | 'stopped';
  riskLevel: 'low' | 'medium' | 'high';
  performance: {
    monthlyReturn: number;
    totalReturn: number;
    annualizedReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
    profitFactor: number;
  };
  targetReturn: {
    monthly: number;
    annual: number;
  };
  parameters: Record<string, any>;
  returns: Array<{
    date: string;
    value: number;
  }>;
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }>;
  backtestResults: Array<{
    equityCurve: Array<{
      date: string;
      value: number;
    }>;
    metrics: {
      totalReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
  }>;
  optimizationResults: Array<{
    parameters: Record<string, any>;
    metrics: {
      totalReturn: number;
      monthlyReturn: number;
      annualizedReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
  }>;
  lastUpdated: string;
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
  id: string;
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  monthlyReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgTradeReturn: number;
  avgWinReturn: number;
  avgLossReturn: number;
  equityCurve: Array<{
    date: string;
    value: number;
  }>;
}

// Add a type for nested property paths
export type NestedStrategyKey = keyof Strategy | `targetReturn.${keyof Strategy['targetReturn']}`; 