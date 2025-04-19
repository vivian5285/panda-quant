import axios from './axios';

export interface ChainAddress {
  _id: string;
  chain: string;
  address: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getChainAddresses = async (): Promise<ChainAddress[]> => {
  const response = await axios.get('/api/chain-addresses');
  return response.data;
};

export const createChainAddress = async (data: Omit<ChainAddress, '_id' | 'createdAt' | 'updatedAt'>): Promise<ChainAddress> => {
  const response = await axios.post('/api/chain-addresses', data);
  return response.data;
};

export const updateChainAddress = async (id: string, data: Partial<Omit<ChainAddress, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ChainAddress> => {
  const response = await axios.put(`/api/chain-addresses/${id}`, data);
  return response.data;
};

export const deleteChainAddress = async (id: string): Promise<void> => {
  await axios.delete(`/api/chain-addresses/${id}`);
}; 