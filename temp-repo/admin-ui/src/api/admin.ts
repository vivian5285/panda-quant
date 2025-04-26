import axios from 'axios';

// 基础 URL，请根据您的实际后端 API 地址进行修改
const API_BASE_URL = '/api/admin';

// 定义 Chain 类型
export interface Chain {
  _id: string;
  name: string;
  address: string;
  isActive: boolean;
  rpcUrl?: string;
  chainId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 定义 User 类型
export interface User {
  _id: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'banned';
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeStrategies: number;
  totalTrades: number;
  totalVolume: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
}

// --- 链管理 API ---

/**
 * 获取所有链信息
 */
export const getChains = async (): Promise<Chain[]> => {
  try {
    const response = await axios.get<Chain[]>(`${API_BASE_URL}/chains`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chains:", error);
    throw error;
  }
};

/**
 * 添加新的链
 * @param chain 要添加的链对象
 */
export const addChain = async (chain: Omit<Chain, '_id' | 'createdAt' | 'updatedAt'>): Promise<Chain> => {
  try {
    const response = await axios.post<Chain>(`${API_BASE_URL}/chains`, chain);
    return response.data;
  } catch (error) {
    console.error("Error adding chain:", error);
    throw error;
  }
};

/**
 * 更新指定 ID 的链信息
 * @param id 要更新的链的 ID
 * @param chain 更新后的链信息
 */
export const updateChain = async (id: string, chain: Partial<Chain>): Promise<Chain> => {
  try {
    const response = await axios.put<Chain>(`${API_BASE_URL}/chains/${id}`, chain);
    return response.data;
  } catch (error) {
    console.error(`Error updating chain with id ${id}:`, error);
    throw error;
  }
};

/**
 * 删除指定 ID 的链
 * @param id 要删除的链的 ID
 */
export const deleteChain = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/chains/${id}`);
  } catch (error) {
    console.error(`Error deleting chain with id ${id}:`, error);
    throw error;
  }
};

// --- 用户管理 API ---

/**
 * 获取所有用户信息
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * 更新用户状态
 * @param id 用户ID
 * @param status 新状态
 */
export const updateUserStatus = async (id: string, status: User['status']): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_BASE_URL}/users/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating user status with id ${id}:`, error);
    throw error;
  }
};

/**
 * 更新用户角色
 * @param id 用户ID
 * @param role 新角色
 */
export const updateUserRole = async (id: string, role: User['role']): Promise<User> => {
  try {
    const response = await axios.put<User>(`${API_BASE_URL}/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating user role with id ${id}:`, error);
    throw error;
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get('/api/admin/dashboard/stats');
  return response.data;
};

export const getSettings = async (): Promise<Settings> => {
  const response = await axios.get('/api/admin/settings');
  return response.data;
};

export const updateSettings = async (settings: Settings): Promise<Settings> => {
  const response = await axios.put('/api/admin/settings', settings);
  return response.data;
};

// 您可以在此文件中继续添加其他的 admin API 调用 