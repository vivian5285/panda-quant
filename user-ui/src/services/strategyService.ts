import axios from 'axios';
import { API_BASE_URL } from '@/config';

export interface Strategy {
  id: number;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'paused' | 'stopped';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface StrategyConfig {
  [key: string]: string | number;
}

export interface StrategyPerformance {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  history: {
    labels: string[];
    data: number[];
  };
}

class StrategyService {
  private static instance: StrategyService;
  private constructor() {}

  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  async getStrategies(): Promise<Strategy[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw error;
    }
  }

  async getStrategyConfig(strategyId: number): Promise<StrategyConfig> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategies/${strategyId}/config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching strategy config:', error);
      throw error;
    }
  }

  async getStrategyPerformance(strategyId: number): Promise<StrategyPerformance> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategies/${strategyId}/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching strategy performance:', error);
      throw error;
    }
  }

  async updateStrategyConfig(strategyId: number, config: StrategyConfig): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/strategies/${strategyId}/config`, config);
    } catch (error) {
      console.error('Error updating strategy config:', error);
      throw error;
    }
  }

  async startStrategy(strategyId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/strategies/${strategyId}/start`);
    } catch (error) {
      console.error('Error starting strategy:', error);
      throw error;
    }
  }

  async stopStrategy(strategyId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/strategies/${strategyId}/stop`);
    } catch (error) {
      console.error('Error stopping strategy:', error);
      throw error;
    }
  }

  async pauseStrategy(strategyId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/strategies/${strategyId}/pause`);
    } catch (error) {
      console.error('Error pausing strategy:', error);
      throw error;
    }
  }
}

export default StrategyService.getInstance(); 