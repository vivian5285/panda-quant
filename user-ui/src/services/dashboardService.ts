import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface TimeRange {
  start: string;
  end: string;
  interval: '1d' | '1w' | '1m' | '3m' | '1y';
}

export interface AssetData {
  total: number;
  change24h: number;
  currencies: Record<string, {
    amount: number;
    valueInUSD: number;
    change24h: number;
  }>;
}

export interface StrategyData {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    maxDrawdown: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ApiStatus {
  id: string;
  exchange: string;
  status: 'active' | 'inactive' | 'error';
  balance: number;
  lastSync: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface ProfitTarget {
  id: string;
  target: number;
  current: number;
  deadline: string;
  progress: number;
  status: 'active' | 'completed' | 'failed';
}

export interface RiskMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
  beta: number;
}

export interface AssetDistribution {
  total: number;
  byCurrency: Record<string, number>;
  byStrategy: Record<string, number>;
}

export interface DashboardData {
  totalAssets: number;
  totalProfit: number;
  activeStrategies: number;
  successRate: number;
  performanceData: Array<{ date: string; value: number }>;
  assetDistribution: {
    total: number;
    byCurrency: Record<string, number>;
    byStrategy: Record<string, number>;
  };
  recentActivities: Array<{
    date: string;
    type: string;
    amount: number;
    status: string;
  }>;
  strategies: Array<{
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused' | 'stopped';
    performance: {
      monthlyReturn: number;
      winRate: number;
      maxDrawdown: number;
    };
  }>;
}

class DashboardService {
  private static instance: DashboardService;
  private baseUrl = '/api/dashboard';

  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getAssets(): Promise<AssetData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/assets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  async getStrategies(): Promise<StrategyData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/strategies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw error;
    }
  }

  async getApiStatus(): Promise<ApiStatus[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/api-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching API status:', error);
      throw error;
    }
  }

  async getChartData(timeRange: TimeRange): Promise<ChartData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/chart`, {
        params: timeRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  }

  async getRiskMetrics(): Promise<RiskMetrics> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/risk-metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
      throw error;
    }
  }

  async createProfitTarget(target: Omit<ProfitTarget, 'id' | 'progress' | 'status'>): Promise<ProfitTarget> {
    try {
      const response = await axios.post(`${API_BASE_URL}/dashboard/profit-targets`, target);
      return response.data;
    } catch (error) {
      console.error('Error creating profit target:', error);
      throw error;
    }
  }

  async deleteProfitTarget(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/dashboard/profit-targets/${id}`);
    } catch (error) {
      console.error('Error deleting profit target:', error);
      throw error;
    }
  }

  async getProfitTargets(): Promise<ProfitTarget[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/profit-targets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profit targets:', error);
      throw error;
    }
  }

  async getAssetDistribution(): Promise<AssetDistribution> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/asset-distribution`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset distribution:', error);
      throw error;
    }
  }

  async startStrategy(strategyId: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/dashboard/strategies/${strategyId}/start`);
    } catch (error) {
      console.error('Error starting strategy:', error);
      throw error;
    }
  }

  async stopStrategy(strategyId: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/dashboard/strategies/${strategyId}/stop`);
    } catch (error) {
      console.error('Error stopping strategy:', error);
      throw error;
    }
  }

  async pauseStrategy(strategyId: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/dashboard/strategies/${strategyId}/pause`);
    } catch (error) {
      console.error('Error pausing strategy:', error);
      throw error;
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await axios.get(`${this.baseUrl}/data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async updateStrategyStatus(strategyId: string, status: 'active' | 'paused' | 'stopped'): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/strategies/${strategyId}/status`, { status });
    } catch (error) {
      console.error('Error updating strategy status:', error);
      throw error;
    }
  }

  async getPerformanceData(timeRange: '1d' | '1w' | '1m' | '3m' | '1y'): Promise<Array<{ date: string; value: number }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/performance`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching performance data:', error);
      throw error;
    }
  }

  async getRecentActivities(): Promise<Array<{
    date: string;
    type: string;
    amount: number;
    status: string;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
}

export default DashboardService.getInstance(); 