import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const getAuthToken = () => {
  const { token } = useAuth();
  return token;
};

export interface ProfitData {
  date: string;
  totalProfit: number;
  strategyProfits: {
    [strategyId: string]: number;
  };
}

export interface ProfitStats {
  totalProfit: number;
  dailyProfit: number;
  monthlyProfit: number;
  annualProfit: number;
  profitTarget: number;
  progress: number;
}

export interface ProfitChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
  }[];
}

const profitService = {
  async getProfitData(timeRange: string): Promise<ProfitData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profit`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        params: {
          timeRange,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profit data:', error);
      throw error;
    }
  },

  async getProfitStats(): Promise<ProfitStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profit/stats`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profit stats:', error);
      throw error;
    }
  },

  async getProfitChartData(timeRange: string): Promise<ProfitChartData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/profit/chart`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        params: {
          timeRange,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profit chart data:', error);
      throw error;
    }
  },

  async setProfitTarget(target: number): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/profit/target`,
        { target },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
    } catch (error) {
      console.error('Error setting profit target:', error);
      throw error;
    }
  },
};

export default profitService; 