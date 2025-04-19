import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，自动添加 token
api.interceptors.request.use(
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

// 添加响应拦截器，处理 token 过期等情况
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    username?: string;
    walletAddress?: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export const authApi = {
  register: async (email: string, password: string, username: string, code: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username,
      code
    });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api; 