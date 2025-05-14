import { StrategyExecutionRequest, StrategyExecutionResponse } from '../interfaces/api';
import { StrategyEngine } from '../engine/StrategyEngine';
import { v4 as uuidv4 } from 'uuid';
import { StrategyParameters } from '../types/strategy';

export const executeStrategy = async (
  request: StrategyExecutionRequest
): Promise<StrategyExecutionResponse> => {
  const executionId = uuidv4();
  
  try {
    const engine = new StrategyEngine();
    const strategyParams: StrategyParameters = {
      userId: request.userId,
      symbol: request.parameters.symbol,
      amount: request.parameters.amount,
      leverage: request.parameters.leverage,
      maxDrawdown: request.parameters.maxDrawdown,
      timeframe: '1h',
      entryRules: ['MA', 'RSI'],
      exitRules: ['MA', 'RSI'],
      riskManagement: {
        stopLoss: 0.02,
        takeProfit: 0.04,
        maxDrawdown: request.parameters.maxDrawdown
      },
      positionSize: {
        type: 'fixed',
        value: request.parameters.amount
      }
    };
    const result = await engine.executeStrategy(request.strategyId, strategyParams);

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

export async function createStrategy(params: {
  userId: string;
  symbol: string;
  amount: number;
  leverage: number;
  maxDrawdown: number;
}): Promise<void> {
  const strategyParams: StrategyParameters = {
    userId: params.userId,
    symbol: params.symbol,
    amount: params.amount,
    leverage: params.leverage,
    maxDrawdown: params.maxDrawdown,
    timeframe: '1h',
    entryRules: ['MA', 'RSI'],
    exitRules: ['MA', 'RSI'],
    riskManagement: {
      stopLoss: 0.02,
      takeProfit: 0.04,
      maxDrawdown: params.maxDrawdown
    },
    positionSize: {
      type: 'fixed',
      value: params.amount
    }
  };

  // 创建策略逻辑
} 