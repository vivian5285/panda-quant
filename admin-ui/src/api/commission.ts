import axios from './axios';
import { AxiosResponse } from 'axios';

export interface Commission {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CommissionFilter {
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CommissionSummary {
  totalAmount: number;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
}

export interface CommissionResponse {
  items: Commission[];
  total: number;
  page: number;
  limit: number;
}

export const getCommissions = async (params?: CommissionFilter): Promise<CommissionResponse> => {
  const response: AxiosResponse<CommissionResponse> = await axios.get('/api/commissions', { params });
  return response.data;
};

export const getCommissionById = async (id: string): Promise<Commission> => {
  const response: AxiosResponse<Commission> = await axios.get(`/api/commissions/${id}`);
  return response.data;
};

export const updateCommissionStatus = async (id: string, status: string): Promise<Commission> => {
  const response: AxiosResponse<Commission> = await axios.put(`/api/commissions/${id}/status`, { status });
  return response.data;
};

export const createCommission = async (data: {
  userId: string;
  amount: number;
  status: string;
}): Promise<Commission> => {
  const response: AxiosResponse<Commission> = await axios.post('/api/commissions', data);
  return response.data;
};

export const deleteCommission = async (id: string): Promise<void> => {
  await axios.delete(`/api/commissions/${id}`);
};

export const exportCommissions = async (filter: CommissionFilter): Promise<Blob> => {
  const response: AxiosResponse<Blob> = await axios.get('/api/commissions/export', {
    params: filter,
    responseType: 'blob',
  });
  return response.data;
};

export const reissueCommission = async (id: string, amount: number): Promise<void> => {
  await axios.post(`/api/commissions/${id}/reissue`, { amount });
}; 