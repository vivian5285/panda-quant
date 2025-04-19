import axios from './axios';

export interface Log {
  _id: string;
  level: string;
  message: string;
  timestamp: string;
  source: string;
  meta?: any;
}

export const getLogs = async (): Promise<Log[]> => {
  const response = await axios.get('/api/logs');
  return response.data;
};

export const createLog = async (data: Omit<Log, '_id' | 'timestamp'>): Promise<Log> => {
  const response = await axios.post('/api/logs', data);
  return response.data;
};

export const updateLog = async (id: string, data: Partial<Omit<Log, '_id' | 'timestamp'>>): Promise<Log> => {
  const response = await axios.put(`/api/logs/${id}`, data);
  return response.data;
};

export const deleteLog = async (id: string): Promise<void> => {
  await axios.delete(`/api/logs/${id}`);
}; 