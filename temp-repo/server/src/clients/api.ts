import axios from 'axios';
import { 
  UserApiResponse, 
  StrategyEngineResponse, 
  StrategyExecutionRequest, 
  StrategyExecutionResponse 
} from '../interfaces/api';

const userApiClient = axios.create({
  baseURL: process.env.USER_API_URL,
  timeout: 5000,
});

const adminApiClient = axios.create({
  baseURL: process.env.ADMIN_API_URL,
  timeout: 5000,
});

const strategyEngineClient = axios.create({
  baseURL: process.env.STRATEGY_ENGINE_URL,
  timeout: 5000,
});

export const executeStrategy = async (
  request: StrategyExecutionRequest
): Promise<StrategyExecutionResponse> => {
  try {
    const response = await strategyEngineClient.post('/strategies/execute', request);
    return response.data;
  } catch (error) {
    console.error('Error executing strategy:', error);
    throw error;
  }
};

export const getUserInfo = async (userId: string): Promise<UserApiResponse> => {
  try {
    const response = await userApiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export const updateStrategyStatus = async (
  executionId: string,
  status: string,
  result?: any
): Promise<void> => {
  try {
    await adminApiClient.post('/strategies/status', {
      executionId,
      status,
      result,
    });
  } catch (error) {
    console.error('Error updating strategy status:', error);
    throw error;
  }
}; 