import axios from 'axios';
import { StrategyExecutionRequest, StrategyExecutionResponse } from '../interfaces/api';

const serverClient = axios.create({
  baseURL: process.env.SERVER_URL,
  timeout: 5000,
});

export const executeStrategy = async (
  request: StrategyExecutionRequest
): Promise<StrategyExecutionResponse> => {
  try {
    const response = await serverClient.post('/strategies/execute', request);
    return response.data;
  } catch (error) {
    console.error('Error executing strategy:', error);
    throw error;
  }
};

export const getStrategyStatus = async (
  executionId: string
): Promise<StrategyExecutionResponse> => {
  try {
    const response = await serverClient.get(`/strategies/status/${executionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting strategy status:', error);
    throw error;
  }
}; 