import { get, post, put } from '@/utils/request';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  parameters: Record<string, any>;
  status: 'active' | 'inactive' | 'pending';
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  rating?: StrategyRating;
  performance?: StrategyPerformance;
}

export interface StrategyRating {
  performance: number;
  risk: number;
  stability: number;
  userSatisfaction: number;
  totalUsers: number;
  averageReturn: number;
  successRate: number;
  lastUpdated: string;
}

export interface StrategyPerformance {
  dailyReturns: number[];
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
}

export interface StrategyFilter {
  name?: string;
  riskLevel?: 'all' | 'low' | 'medium' | 'high';
  status?: 'all' | 'active' | 'inactive' | 'pending';
  creatorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface StrategyResponse {
  strategies: Strategy[];
  total: number;
}

export async function getStrategies(filter: StrategyFilter): Promise<StrategyResponse> {
  return get('/strategies', filter);
}

export async function getStrategyDetails(id: string): Promise<Strategy> {
  return get(`/strategies/${id}`);
}

export async function createStrategy(strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Strategy> {
  return post('/strategies', strategy);
}

export async function updateStrategy(id: string, strategy: Partial<Strategy>): Promise<Strategy> {
  return put(`/strategies/${id}`, strategy);
}

export async function updateStrategyStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<void> {
  return put(`/strategies/${id}/status`, { status });
}

export async function getStrategyRatings(id: string): Promise<StrategyRating> {
  return get(`/strategies/${id}/ratings`);
}

export async function getStrategyPerformance(id: string): Promise<StrategyPerformance> {
  return get(`/strategies/${id}/performance`);
} 