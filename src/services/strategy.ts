import { StrategyExecutionRequest, StrategyExecutionResponse } from '../interfaces/api';
import { StrategyEngine } from '../engine/StrategyEngine';
import { v4 as uuidv4 } from 'uuid';
import { StrategyParams } from '../types/strategy';
import { logger } from '../utils/logger';

export const executeStrategy = async (
  request: StrategyExecutionRequest
): Promise<StrategyExecutionResponse> => {
  const executionId = uuidv4();
  
  try {
    const engine = new StrategyEngine();
    const strategyParams: StrategyParams = {
      userId: request.userId,
      symbol: request.parameters.symbol,
      amount: request.parameters.amount,
      leverage: request.parameters.leverage,
      maxDrawdown: request.parameters.maxDrawdown
    };
    const result = await engine.executeStrategy(request.strategyId, strategyParams);

    return {
      executionId,
      status: result.status,
      result: result.data,
      message: result.message
    };
  } catch (error) {
    logger.error('Strategy execution failed:', error);
    return {
      executionId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Strategy execution failed'
    };
  }
}; 