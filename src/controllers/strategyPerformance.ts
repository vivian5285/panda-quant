import { Request, Response } from 'express';
import { StrategyPerformanceService } from '../services/strategyPerformance';

export class StrategyPerformanceController {
  static async createStrategyPerformance(req: Request, res: Response) {
    try {
      const strategyPerformance = await StrategyPerformanceService.createStrategyPerformance(req.body);
      res.status(201).json(strategyPerformance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create strategy performance' });
    }
  }

  static async getStrategyPerformanceById(req: Request, res: Response) {
    try {
      const strategyPerformance = await StrategyPerformanceService.getStrategyPerformanceById(req.params.id);
      if (!strategyPerformance) {
        return res.status(404).json({ error: 'Strategy performance not found' });
      }
      res.json(strategyPerformance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get strategy performance' });
    }
  }

  static async getStrategyPerformanceByStrategyId(req: Request, res: Response) {
    try {
      const strategyPerformance = await StrategyPerformanceService.getStrategyPerformanceByStrategyId(req.params.strategyId);
      res.json(strategyPerformance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get strategy performance' });
    }
  }

  static async getStrategyPerformanceByUserId(req: Request, res: Response) {
    try {
      const strategyPerformance = await StrategyPerformanceService.getStrategyPerformanceByUserId(req.params.userId);
      res.json(strategyPerformance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get strategy performance' });
    }
  }

  static async updateStrategyPerformance(req: Request, res: Response) {
    try {
      const strategyPerformance = await StrategyPerformanceService.updateStrategyPerformance(req.params.id, req.body);
      if (!strategyPerformance) {
        return res.status(404).json({ error: 'Strategy performance not found' });
      }
      res.json(strategyPerformance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update strategy performance' });
    }
  }

  static async deleteStrategyPerformance(req: Request, res: Response) {
    try {
      const strategyPerformance = await StrategyPerformanceService.deleteStrategyPerformance(req.params.id);
      if (!strategyPerformance) {
        return res.status(404).json({ error: 'Strategy performance not found' });
      }
      res.json({ message: 'Strategy performance deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete strategy performance' });
    }
  }
} 