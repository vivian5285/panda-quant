import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // 如果返回的是文件流,直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 处理业务错误
    if (data.code !== 0) {
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }

    return data.data;
  },
  (error: AxiosError) => {
    // 处理 HTTP 错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // token 过期,跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error('网络错误');
      }
    } else if (error.request) {
      message.error('网络错误,请检查网络连接');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export function get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, { params, ...config });
}

// 封装 POST 请求
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config);
}

// 封装 PUT 请求
export function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.put(url, data, config);
}

// 封装 DELETE 请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete(url, config);
}

// 导出默认实例
export default request; 