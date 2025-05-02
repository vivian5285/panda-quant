// 控制器接口类型声明
import { Request, Response } from 'express';

export interface StrategyController {
  createStrategy(req: Request, res: Response): Promise<void>;
  updateStrategy(req: Request, res: Response): Promise<void>;
  deleteStrategy(req: Request, res: Response): Promise<void>;
  getStrategy(req: Request, res: Response): Promise<void>;
  listStrategies(req: Request, res: Response): Promise<void>;
}

export interface HealthController {
  checkHealth(req: Request, res: Response): Promise<void>;
  getMetrics(req: Request, res: Response): Promise<void>;
  getStatus(req: Request, res: Response): Promise<void>;
} 