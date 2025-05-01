import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const healthController = {
  async checkHealth(_req: Request, res: Response): Promise<void> {
    try {
      // 这里可以添加更多的健康检查逻辑
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(500).json({
        status: 'error',
        message: 'Health check failed'
      });
    }
  }
}; 