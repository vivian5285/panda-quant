import axios from 'axios';
import { BlacklistEntry } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const blacklistService = {
  // 获取所有黑名单条目
  async getAllEntries(): Promise<BlacklistEntry[]> {
    const response = await axios.get(`${API_URL}/blacklist`);
    return response.data;
  },

  // 创建新黑名单条目
  async createEntry(entry: Omit<BlacklistEntry, 'id' | 'createdAt'>): Promise<BlacklistEntry> {
    const response = await axios.post(`${API_URL}/blacklist`, entry);
    return response.data;
  },

  // 更新黑名单条目
  async updateEntry(id: string, entry: Partial<BlacklistEntry>): Promise<BlacklistEntry> {
    const response = await axios.put(`${API_URL}/blacklist/${id}`, entry);
    return response.data;
  },

  // 删除黑名单条目
  async deleteEntry(id: string): Promise<void> {
    await axios.delete(`${API_URL}/blacklist/${id}`);
  },

  // 获取黑名单条目详情
  async getEntryById(id: string): Promise<BlacklistEntry> {
    const response = await axios.get(`${API_URL}/blacklist/${id}`);
    return response.data;
  },

  // 搜索黑名单条目
  async searchEntries(query: string): Promise<BlacklistEntry[]> {
    const response = await axios.get(`${API_URL}/blacklist/search`, {
      params: { query }
    });
    return response.data;
  }
}; 