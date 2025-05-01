// 交易所配置类型
export interface ExchangeConfig {
  exchangeName: string;
  apiKey: string;
  apiSecret: string;
  testnet?: boolean;
}

// MT4配置类型
export interface MT4Config {
  server: string;
  port: number;
  login: string;
  password: string;
}

// 交易订单类型
export interface Order {
  id: string;
  strategyId: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 账户信息类型
export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  positions: Position[];
}

// 持仓信息类型
export interface Position {
  symbol: string;
  type: 'long' | 'short';
  volume: number;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  swap: number;
  commission: number;
}

// K线数据类型
export interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 策略执行结果类型
export interface StrategyResult {
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  price: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// 交易记录类型
export interface Trade {
  id: string;
  strategyId: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  profit?: number;
}

// 用户配置类型
export interface UserConfig {
  userId: string;
  exchangeConfig?: ExchangeConfig;
  mt4Config?: MT4Config;
  riskLevel: 'high' | 'medium' | 'low';
  maxPositionSize: number;
  maxDailyLoss: number;
  autoStopLoss: boolean;
  autoTakeProfit: boolean;
}

export interface StrategyPreset {
  id: string;
  name: string;
  params: Record<string, any>;
}

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  parameters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyStats {
  totalProfit: number;
  maxDrawdown: number;
  winRate: number;
  trades: Trade[];
}

export interface MarketInfo {
  symbol: string;
  minAmount: number;
  maxAmount: number;
  pricePrecision: number;
  amountPrecision: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface StrategyExecutionResult {
  id: string;
  strategyId: string;
  status: 'success' | 'failed';
  startTime: Date;
  endTime: Date;
  trades: Trade[];
  performance: {
    monthlyReturn: number;
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
} 