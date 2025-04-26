import { StrategyExecutionRequest, StrategyExecutionResponse } from '../interfaces/api';
import { StrategyEngine } from '../engine/StrategyEngine';
import { v4 as uuidv4 } from 'uuid';

export const executeStrategy = async (
  request: StrategyExecutionRequest
): Promise<StrategyExecutionResponse> => {
  const executionId = uuidv4();
  
  try {
    const engine = new StrategyEngine();
    const result = await engine.executeStrategy(request.strategyId, request.parameters);

    return {
      executionId,
      status: 'completed',
      result
    };
  } catch (error) {
    console.error('Strategy execution failed:', error);
    return {
      executionId,
      status: 'failed',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}; 