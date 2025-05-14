export * from './strategy';
export * from './order';

export interface IAlert {
  id: string;
  type: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  createdAt: Date;
  userId: string;
}

export interface IBlacklistEntry {
  id: string;
  symbol: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
}

export interface ICommission {
  id: string;
  symbol: string;
  rate: number;
  minAmount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface INetworkStatus {
  id: string;
  status: 'online' | 'offline';
  latency: number;
  lastChecked: Date;
  network: string;
}

export interface IStrategyPerformance {
  id: string;
  strategyId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  totalProfit: number;
  maxDrawdown: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

export interface IUserLevel {
  id: string;
  name: string;
  description: string;
  requirements: {
    minBalance: number;
    minTrades: number;
  };
  benefits: {
    commissionDiscount: number;
    maxLeverage: number;
  };
} 