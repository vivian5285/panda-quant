import { User, UserFormData } from '../types/user';

// 模拟 API 调用
export const getUsers = async (): Promise<User[]> => {
  // 这里应该是实际的 API 调用
  return [
    {
      _id: '1',
      username: 'admin',
      email: 'admin@example.com',
      status: 'active',
      role: 'admin',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    // 添加更多模拟数据...
  ];
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  // 这里应该是实际的 API 调用
  return {
    _id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    status: userData.status,
    role: userData.role,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  // 这里应该是实际的 API 调用
  return {
    _id: userId,
    username: userData.username || '',
    email: userData.email || '',
    status: userData.status || 'active',
    role: userData.role || 'user',
    lastLogin: new Date().toISOString(),
    createdAt: userData.createdAt || new Date().toISOString(),
  };
};

export const deleteUser = async (userId: string): Promise<void> => {
  // 这里应该是实际的 API 调用
}; 