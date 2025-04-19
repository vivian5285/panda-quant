import axiosInstance from '../utils/axiosInstance';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStatus {
  _id: string;
  email: string;
  status: 'active' | 'insufficient_balance' | 'suspended';
  balance: number;
  hostingFee: number;
  deductionCredit: number;
  lastDeductionDate: Date;
  nextDeductionDate: Date;
  lastLoginAt: Date;
  rechargeCount: number;
  totalRechargeAmount: number;
}

export interface UserStatusResponse {
  users: UserStatus[];
  totalPages: number;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/api/admin/users');
  return response.data;
};

export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
  const response = await axiosInstance.post('/api/admin/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id'>>): Promise<User> => {
  const response = await axiosInstance.put(`/api/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/admin/users/${id}`);
};

export const getUserStatuses = async (page: number): Promise<UserStatusResponse> => {
  const response = await axiosInstance.get(`/api/admin/user-statuses?page=${page}`);
  return response.data;
};

export const updateUserStatus = async (id: string, data: Partial<Omit<UserStatus, '_id'>>): Promise<UserStatus> => {
  const response = await axiosInstance.put(`/api/admin/user-statuses/${id}`, data);
  return response.data;
}; 