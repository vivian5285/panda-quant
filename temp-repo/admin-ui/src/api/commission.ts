import { get, post } from '@/utils/request';

export interface Commission {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  details: {
    orderId: string;
    orderAmount: number;
    commissionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommissionFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  status?: 'all' | 'pending' | 'completed' | 'failed';
}

export interface CommissionSummary {
  totalAmount: number;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
}

export interface CommissionResponse {
  commissions: Commission[];
  summary: CommissionSummary;
}

export async function getCommissions(filter: CommissionFilter): Promise<CommissionResponse> {
  return get('/commissions', filter);
}

export const getCommissionDetails = async (id: string): Promise<Commission> => {
  try {
    const response = await request(`/api/commissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commission details:', error);
    throw error;
  }
};

export const updateCommissionStatus = async (id: string, status: 'completed' | 'failed'): Promise<Commission> => {
  try {
    const response = await request.put(`/api/commissions/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating commission status:', error);
    throw error;
  }
};

export const exportCommissions = async (filter: CommissionFilter): Promise<Blob> => {
  try {
    const response = await request.get('/api/commissions/export', {
      params: filter,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting commissions:', error);
    throw error;
  }
};

export async function reissueCommission(id: string, amount: number): Promise<void> {
  return post(`/commissions/${id}/reissue`, { amount });
} 