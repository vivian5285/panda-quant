import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface ProfitData {
  date: string;
  profit: number;
}

// 获取用户可用的策略
export const getUserStrategies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/strategy/user-strategies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user strategies:', error);
    throw error;
  }
};

// 获取用户收益数据
export const getUserProfits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/strategy/user-profits`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profits:', error);
    throw error;
  }
};

// 创建新策略
export const createStrategy = async (strategyData: {
  name: string;
  description: string;
  riskLevel: '低' | '中等' | '较高';
  expectedReturn: number;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/strategy/strategies`, strategyData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating strategy:', error);
    throw error;
  }
};

// 更新策略状态
export const updateStrategyStatus = async (strategyId: string, active: boolean) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/strategy/strategies/${strategyId}/status`,
      { active },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating strategy status:', error);
    throw error;
  }
}; 