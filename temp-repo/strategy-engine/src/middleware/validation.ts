import { Request, Response, NextFunction } from 'express';
import { StrategyExecutionRequest } from '../interfaces/api';

export const validateStrategyExecution = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { strategyId, userId, parameters } = req.body as StrategyExecutionRequest;

  if (!strategyId || !userId) {
    return res.status(400).json({ error: '缺少必要的参数' });
  }

  if (typeof parameters !== 'object') {
    return res.status(400).json({ error: '参数格式不正确' });
  }

  next();
}; 