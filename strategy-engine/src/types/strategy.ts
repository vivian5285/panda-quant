export enum StrategyType {
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MEAN_REVERSION = 'MEAN_REVERSION',
  BREAKOUT = 'BREAKOUT',
  SCALPING = 'SCALPING',
  GRID = 'GRID',
  CUSTOM = 'CUSTOM'
}

export enum StrategyStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
  RUNNING = 'RUNNING'
}

export interface Strategy {
  id: string;
  name: string;
  type: StrategyType;
  status: StrategyStatus;
  parameters: StrategyParameters;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyParameters {
  symbol: string;
  timeframe: string;
  entryRules: any[];
  exitRules: any[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxDrawdown: number;
  };
  positionSize: {
    type: 'fixed' | 'percentage';
    value: number;
  };
  [key: string]: any;
} 