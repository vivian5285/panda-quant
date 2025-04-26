import { Request, Response } from 'express';
import { StrategyExecutionRequest, StrategyExecutionResponse } from '../interfaces/api';
import { executeStrategy as executeStrategyService } from '../services/strategy';
import { updateStrategyStatus } from '../services/status';

export const executeStrategy = async (req: Request, res: Response) => {
  try {
    const request: StrategyExecutionRequest = req.body;
    const result = await executeStrategyService(request);
    
    // 异步更新策略状态
    updateStrategyStatus(result.executionId, result.status, result.result)
      .catch(error => console.error('Failed to update strategy status:', error));

    res.json(result);
  } catch (error) {
    console.error('Strategy execution failed:', error);
    res.status(500).json({
      executionId: req.body.strategyId,
      status: 'failed',
      error: '策略执行失败'
    });
  }
}; 