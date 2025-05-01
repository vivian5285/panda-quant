import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface Strategy {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'stopped';
  riskLevel: 'low' | 'medium' | 'high';
  performance: {
    monthlyReturn: number;
    totalReturn: number;
    annualizedReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
    profitFactor: number;
  };
  targetReturn: {
    monthly: number;
    annual: number;
  };
  parameters: Record<string, any>;
  returns: Array<{
    date: string;
    value: number;
  }>;
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }>;
  backtestResults: Array<{
    equityCurve: Array<{
      date: string;
      value: number;
    }>;
    metrics: {
      totalReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
  }>;
  optimizationResults: Array<{
    parameters: Record<string, any>;
    metrics: {
      totalReturn: number;
      monthlyReturn: number;
      annualizedReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
  }>;
  lastUpdated: string;
}

class StrategyService {
  private static instance: StrategyService;
  private baseUrl = '/api/strategies';

  private constructor() {}

  static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  async getStrategies(): Promise<Strategy[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}${this.baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw error;
    }
  }

  async updateStrategy(strategy: Strategy): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}${this.baseUrl}/${strategy.id}`, strategy);
    } catch (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }
  }

  async createStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
    try {
      const response = await axios.post(`${API_BASE_URL}${this.baseUrl}`, strategy);
      return response.data;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }
  }

  async deleteStrategy(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting strategy:', error);
      throw error;
    }
  }
}

export const strategyService = StrategyService.getInstance(); 