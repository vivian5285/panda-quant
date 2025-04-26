import axios from 'axios';
import { UserLevel } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const userLevelService = {
  // 获取所有用户等级
  async getAllLevels(): Promise<UserLevel[]> {
    const response = await axios.get(`${API_URL}/user-levels`);
    return response.data;
  },

  // 创建新等级
  async createLevel(level: Omit<UserLevel, 'id'>): Promise<UserLevel> {
    const response = await axios.post(`${API_URL}/user-levels`, level);
    return response.data;
  },

  // 更新等级
  async updateLevel(id: string, level: Partial<UserLevel>): Promise<UserLevel> {
    const response = await axios.put(`${API_URL}/user-levels/${id}`, level);
    return response.data;
  },

  // 删除等级
  async deleteLevel(id: string): Promise<void> {
    await axios.delete(`${API_URL}/user-levels/${id}`);
  },

  // 获取等级详情
  async getLevelById(id: string): Promise<UserLevel> {
    const response = await axios.get(`${API_URL}/user-levels/${id}`);
    return response.data;
  }
}; 