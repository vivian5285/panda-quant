export interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'admin' | 'user' | 'manager';
  lastLogin: string;
  avatar?: string;
}

// 模拟 API 调用
export const getUsers = async (): Promise<User[]> => {
  // 这里应该是实际的 API 调用
  return [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      status: 'active',
      role: 'admin',
      lastLogin: new Date().toISOString(),
    },
    // 添加更多模拟数据...
  ];
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  // 这里应该是实际的 API 调用
  return {
    id: Date.now().toString(),
    username: userData.username || '',
    email: userData.email || '',
    status: userData.status || 'active',
    role: userData.role || 'user',
    lastLogin: new Date().toISOString(),
  };
};

export const updateUser = async (userData: User): Promise<User> => {
  // 这里应该是实际的 API 调用
  return userData;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // 这里应该是实际的 API 调用
}; 