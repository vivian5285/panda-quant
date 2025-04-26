import { get, post, put } from '@/utils/request';

export interface Settlement {
  id: string;
  userId: string;
  amount: number;
  commissionIds: string[];
  status: 'pending' | 'completed' | 'failed';
  platformShare: number;
  level1Share: number;
  level2Share: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  status?: 'all' | 'pending' | 'completed' | 'failed';
}

export interface SettlementSummary {
  totalAmount: number;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  platformTotal: number;
  level1Total: number;
  level2Total: number;
}

export interface SettlementResponse {
  settlements: Settlement[];
  summary: SettlementSummary;
}

export async function getSettlements(filter: SettlementFilter): Promise<SettlementResponse> {
  return get('/settlements', filter);
}

export async function getSettlementDetails(id: string): Promise<Settlement> {
  return get(`/settlements/${id}`);
}

export async function updateSettlementStatus(id: string, status: 'completed' | 'failed'): Promise<void> {
  return put(`/settlements/${id}/status`, { status });
}

export async function exportSettlements(filter: SettlementFilter): Promise<Blob> {
  return get('/settlements/export', filter, { responseType: 'blob' });
}

export async function generateSettlements(startDate: string, endDate: string): Promise<void> {
  return post('/settlements/generate', { startDate, endDate });
}

export async function processPayment(id: string): Promise<void> {
  return post(`/settlements/${id}/process`);
} 