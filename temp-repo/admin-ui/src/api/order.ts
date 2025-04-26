import { get, post, put } from '@/utils/request';

export interface Order {
  id: string;
  userId: string;
  strategyId: string;
  amount: number;
  chain: string;
  status: 'running' | 'pending' | 'abnormal' | 'ended';
  startTime: string;
  endTime?: string;
  anomalies?: OrderAnomaly[];
  performance?: OrderPerformance;
}

export interface OrderAnomaly {
  type: 'continuous_loss' | 'unusual_volume' | 'price_deviation';
  severity: 'warning' | 'critical';
  description: string;
  suggestedAction: string;
  timestamp: string;
}

export interface OrderPerformance {
  totalReturn: number;
  dailyReturns: number[];
  maxDrawdown: number;
  winRate: number;
  tradeCount: number;
  lastUpdated: string;
}

export interface OrderFilter {
  userId?: string;
  strategyId?: string;
  chain?: string;
  status?: 'all' | 'running' | 'pending' | 'abnormal' | 'ended';
  startDate?: string;
  endDate?: string;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
}

export async function getOrders(filter: OrderFilter): Promise<OrderResponse> {
  return get('/orders', filter);
}

export async function getOrderDetails(id: string): Promise<Order> {
  return get(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: 'running' | 'pending' | 'abnormal' | 'ended'): Promise<void> {
  return put(`/orders/${id}/status`, { status });
}

export async function getOrderAnomalies(id: string): Promise<OrderAnomaly[]> {
  return get(`/orders/${id}/anomalies`);
}

export async function getOrderPerformance(id: string): Promise<OrderPerformance> {
  return get(`/orders/${id}/performance`);
}

export async function markOrderAbnormal(id: string, reason: string): Promise<void> {
  return post(`/orders/${id}/mark-abnormal`, { reason });
} 