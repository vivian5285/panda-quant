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
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  status: 'open' | 'closed' | 'canceled';
  createdAt: number;
  updatedAt: number;
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
  timestamp: number;
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
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: number;
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
  name: string;
  description: string;
  params: {
    [key: string]: {
      type: 'number' | 'boolean' | 'string';
      default: any;
      min?: number;
      max?: number;
      step?: number;
    };
  };
}

export interface Strategy {
  id: string;
  symbol: string;
  timeframe: string;
  params: any;
  position: 'long' | 'short' | 'none';
  entryPrice: number;
  trades: Trade[];

  analyzeMarket(data: OHLCV[]): Promise<'buy' | 'sell' | 'hold'>;
  executeTrade(signal: 'buy' | 'sell', price: number): Promise<void>;
  getStats(): StrategyStats;
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