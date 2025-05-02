// 基础模型类型声明
export interface Blacklist {
  id: string;
  userId: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionRule {
  id: string;
  level: number;
  rate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyRating {
  id: string;
  strategyId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLevel {
  id: string;
  userId: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  strategyId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price?: number;
  quantity: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
} 