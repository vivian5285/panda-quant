import { Request, Response } from 'express';
import { StrategyService } from '../services/StrategyService';
import { IStrategy, IStrategyCreateInput } from '../types/Strategy';
import { logger } from '../utils/logger';

export class StrategyController {
  private strategyService: StrategyService;

  constructor() {
    this.strategyService = StrategyService.getInstance();
  }

  async createStrategy(req: Request, res: Response): Promise<void> {
    try {
      const strategyData = req.body as IStrategyCreateInput;
      if (!strategyData.name) {
        res.status(400).json({ message: 'Strategy name is required' });
        return;
      }
      const strategy = await this.strategyService.createStrategy(strategyData);
      res.status(201).json(strategy);
    } catch (error) {
      logger.error('Error creating strategy:', error);
      res.status(500).json({ message: 'Error creating strategy' });
    }
  }

  async getStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const strategy = await this.strategyService.getStrategyById(id);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      res.json(strategy);
    } catch (error) {
      logger.error('Error getting strategy:', error);
      res.status(500).json({ message: 'Error getting strategy' });
    }
  }

  async updateStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body as Partial<IStrategy>;
      const strategy = await this.strategyService.updateStrategy(id, updates);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      res.json(strategy);
    } catch (error) {
      logger.error('Error updating strategy:', error);
      res.status(500).json({ message: 'Error updating strategy' });
    }
  }

  async deleteStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.strategyService.deleteStrategy(id);
      if (!success) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      res.status(500).json({ message: 'Error deleting strategy' });
    }
  }

  async getAllStrategies(req: Request, res: Response): Promise<void> {
    try {
      const strategies = await this.strategyService.getAllStrategies();
      res.json(strategies);
    } catch (error) {
      logger.error('Error getting all strategies:', error);
      res.status(500).json({ message: 'Error getting all strategies' });
    }
  }

  async startStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const strategy = await this.strategyService.getStrategyById(id);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      await this.strategyService.startStrategy(strategy);
      res.json({ message: 'Strategy started successfully' });
    } catch (error) {
      logger.error('Error starting strategy:', error);
      res.status(500).json({ message: 'Error starting strategy' });
    }
  }

  async stopStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const strategy = await this.strategyService.getStrategyById(id);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      await this.strategyService.stopStrategy(strategy);
      res.json({ message: 'Strategy stopped successfully' });
    } catch (error) {
      logger.error('Error stopping strategy:', error);
      res.status(500).json({ message: 'Error stopping strategy' });
    }
  }

  async pauseStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const strategy = await this.strategyService.getStrategyById(id);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      await this.strategyService.pauseStrategy(strategy);
      res.json({ message: 'Strategy paused successfully' });
    } catch (error) {
      logger.error('Error pausing strategy:', error);
      res.status(500).json({ message: 'Error pausing strategy' });
    }
  }

  async resumeStrategy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const strategy = await this.strategyService.getStrategyById(id);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      await this.strategyService.resumeStrategy(strategy);
      res.json({ message: 'Strategy resumed successfully' });
    } catch (error) {
      logger.error('Error resuming strategy:', error);
      res.status(500).json({ message: 'Error resuming strategy' });
    }
  }

  async getStrategiesByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const strategies = await this.strategyService.getStrategiesByUser(userId);
      res.json(strategies);
    } catch (error) {
      logger.error('Error getting strategies by user:', error);
      res.status(500).json({ message: 'Error getting strategies by user' });
    }
  }

  async getActiveStrategies(req: Request, res: Response): Promise<void> {
    try {
      const strategies = await this.strategyService.getActiveStrategies();
      res.json(strategies);
    } catch (error) {
      logger.error('Error getting active strategies:', error);
      res.status(500).json({ message: 'Error getting active strategies' });
    }
  }

  async getPopularStrategies(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const strategies = await this.strategyService.getPopularStrategies(limit);
      res.json(strategies);
    } catch (error) {
      logger.error('Error getting popular strategies:', error);
      res.status(500).json({ message: 'Error getting popular strategies' });
    }
  }
} 