import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface ApiConnection {
  exchange: string;
  status: 'connected' | 'disconnected' | 'error';
  permissions: string[];
  lastUpdate: string;
}

export interface ApiStatus {
  exchange: string;
  status: 'connected' | 'disconnected' | 'error';
  lastUpdate: string;
}

class ApiService {
  private static instance: ApiService;
  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async getConnections(): Promise<ApiConnection[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/connections`);
      return response.data;
    } catch (error) {
      console.error('Error fetching API connections:', error);
      throw error;
    }
  }

  async getStatus(): Promise<ApiStatus[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching API status:', error);
      throw error;
    }
  }

  async connect(exchange: string, apiKey: string, apiSecret: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/connect`, {
        exchange,
        apiKey,
        apiSecret
      });
    } catch (error) {
      console.error('Error connecting API:', error);
      throw error;
    }
  }

  async disconnect(exchange: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/connect`, {
        data: { exchange }
      });
    } catch (error) {
      console.error('Error disconnecting API:', error);
      throw error;
    }
  }

  async getPermissions(exchange: string): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/permissions`, {
        params: { exchange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching API permissions:', error);
      throw error;
    }
  }
}

export default ApiService.getInstance(); 