import axiosInstance from '../utils/axiosInstance';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getStrategies = async (): Promise<Strategy[]> => {
  const response = await axiosInstance.get('/api/admin/strategies');
  return response.data;
};

export const createStrategy = async (data: Omit<Strategy, 'id'>): Promise<Strategy> => {
  const response = await axiosInstance.post('/api/admin/strategies', data);
  return response.data;
};

export const updateStrategy = async (id: string, data: Partial<Omit<Strategy, 'id'>>): Promise<Strategy> => {
  const response = await axiosInstance.put(`/api/admin/strategies/${id}`, data);
  return response.data;
};

export const deleteStrategy = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/admin/strategies/${id}`);
}; 