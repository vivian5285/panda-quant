import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    inviteCode: string;
    referredBy?: string;
  };
}

export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || '登录失败');
    }
    throw new Error('登录失败，请稍后重试');
  }
};

export const register = async (data: { email: string; password: string; inviteCode: string }): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || '注册失败');
    }
    throw new Error('注册失败，请稍后重试');
  }
};

// 设置 axios 默认配置
axios.defaults.baseURL = API_BASE_URL;

// 添加请求拦截器，自动添加 token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理 token 过期
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const getUserInfo = async (): Promise<AuthResponse['user']> => {
  const response = await axios.get('/auth/me');
  return response.data;
};

export const updateUserInfo = async (data: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> => {
  const response = await axios.put('/auth/me', data);
  return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }): Promise<void> => {
  await axios.put('/auth/password', data);
}; 