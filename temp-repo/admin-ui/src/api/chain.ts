import axios from './axios';

export interface Chain {
  _id: string;
  chain: string;
  address: string;
  isActive: boolean;
  status: string;
}

export const getChains = async (): Promise<Chain[]> => {
  const response = await axios.get('/api/chains');
  return response.data;
};

export const createChain = async (data: Omit<Chain, '_id'>): Promise<Chain> => {
  const response = await axios.post('/api/chains', data);
  return response.data;
};

export const updateChain = async (id: string, data: Partial<Omit<Chain, '_id'>>): Promise<Chain> => {
  const response = await axios.put(`/api/chains/${id}`, data);
  return response.data;
};

export const deleteChain = async (id: string): Promise<void> => {
  await axios.delete(`/api/chains/${id}`);
}; 