import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// 设置默认的 axios 配置
axios.defaults.baseURL = API_URL;

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

// 添加响应拦截器，处理 token 过期等情况
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    inviteCode: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (
  email: string,
  password: string,
  inviteCode?: string
): Promise<AuthResponse> => {
  const response = await axios.post('/auth/register', {
    email,
    password,
    inviteCode
  });
  return response.data;
}; 