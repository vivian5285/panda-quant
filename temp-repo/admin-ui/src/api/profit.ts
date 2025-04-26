import { get } from '@/utils/request';

export interface Profit {
  id: string;
  userId: string;
  amount: number;
  type: 'strategy' | 'commission';
  status: 'pending' | 'completed' | 'failed';
  details: {
    strategyId?: string;
    strategyName?: string;
    commissionId?: string;
    commissionRate?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProfitFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  type?: 'all' | 'strategy' | 'commission';
  status?: 'all' | 'pending' | 'completed' | 'failed';
}

export interface ProfitSummary {
  totalAmount: number;
  totalCount: number;
  strategyAmount: number;
  commissionAmount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
}

export interface ProfitResponse {
  profits: Profit[];
  summary: ProfitSummary;
}

export async function getProfits(filter: ProfitFilter): Promise<ProfitResponse> {
  return get('/profits', filter);
}

export async function getProfitDetails(id: string): Promise<Profit> {
  return get(`/profits/${id}`);
}

export async function exportProfits(filter: ProfitFilter): Promise<Blob> {
  return get('/profits/export', {
    params: filter,
    responseType: 'blob',
  });
} 