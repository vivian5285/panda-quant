export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'spot' | 'futures' | 'mt4';
  exchange: string;
  symbol: string;
  timeframe: string;
  parameters: Record<string, any>;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyExecution {
  id: string;
  strategyId: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  parameters: Record<string, any>;
  startTime: Date;
  endTime?: Date;
  result?: StrategyResult;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalProfit: number;
  monthlyReturn: number;
  trades: StrategyTrade[];
}

export interface StrategyTrade {
  id: string;
  executionId: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  amount: number;
  profit: number;
  entryTime: Date;
  exitTime: Date;
  duration: number;
}

export interface StrategyPerformance {
  strategyId: string;
  userId: string;
  totalProfit: number;
  monthlyReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  startDate: Date;
  endDate: Date;
}

export interface StrategyParameter {
  name: string;
  type: 'number' | 'string' | 'boolean';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  description: string;
} 