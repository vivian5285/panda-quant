import axios from 'axios';
import { StrategyStatusUpdate } from '../interfaces/api';

export const updateStrategyStatus = async (
  executionId: string,
  status: string,
  result?: any
): Promise<void> => {
  try {
    const update: StrategyStatusUpdate = {
      executionId,
      status: status as 'pending' | 'running' | 'completed' | 'failed',
      result
    };

    await axios.post(`${process.env.SERVER_URL}/strategies/status`, update);
  } catch (error) {
    console.error('Failed to update strategy status:', error);
    throw error;
  }
}; 