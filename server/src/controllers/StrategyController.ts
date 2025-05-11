import { Request, Response } from 'express';
import { StrategyService } from '../services/StrategyService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/Logger';
import { Types } from 'mongoose';
import { StrategyCreateInput, StrategyUpdateInput } from '../types/Strategy';
import { AuthenticatedRequest } from '../types/Auth';

export class StrategyController {
  private strategyService: StrategyService;

  constructor() {
    this.strategyService = StrategyService.getInstance();
  }

  async createStrategy(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const data: StrategyCreateInput = {
        ...req.body,
        userId: new Types.ObjectId(req.user._id)
      };
      const strategy = await this.strategyService.createStrategy(data);
      return res.status(201).json(strategy);
    } catch (error) {
      logger.error('Error creating strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getStrategy(req: Request, res: Response): Promise<Response> {
    try {
      const strategy = await this.strategyService.getStrategyById(req.params.id);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(strategy);
    } catch (error) {
      logger.error('Error getting strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserStrategies(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const strategies = await this.strategyService.getStrategiesByUserId(new Types.ObjectId(req.user._id));
      return res.json(strategies);
    } catch (error) {
      logger.error('Error getting user strategies:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateStrategy(req: Request, res: Response): Promise<Response> {
    try {
      const data: StrategyUpdateInput = req.body;
      const strategy = await this.strategyService.updateStrategy(req.params.id, data);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(strategy);
    } catch (error) {
      logger.error('Error updating strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteStrategy(req: Request, res: Response): Promise<Response> {
    try {
      await this.strategyService.deleteStrategy(req.params.id);
      return res.status(204).send();
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getStrategyPerformance(req: Request, res: Response): Promise<Response> {
    try {
      const performance = await this.strategyService.getStrategyPerformance(req.params.id);
      if (!performance) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(performance);
    } catch (error) {
      logger.error('Error getting strategy performance:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateStrategyStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { status } = req.body;
      const strategy = await this.strategyService.updateStrategyStatus(req.params.id, status);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(strategy);
    } catch (error) {
      logger.error('Error updating strategy status:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getStrategyMetrics(req: Request, res: Response): Promise<Response> {
    try {
      const metrics = await this.strategyService.getStrategyMetrics(req.params.id);
      if (!metrics) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(metrics);
    } catch (error) {
      logger.error('Error getting strategy metrics:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getStrategyHistory(req: Request, res: Response): Promise<Response> {
    try {
      const history = await this.strategyService.getStrategyHistory(req.params.id);
      return res.json(history);
    } catch (error) {
      logger.error('Error getting strategy history:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getStrategyConfig(req: Request, res: Response): Promise<Response> {
    try {
      const config = await this.strategyService.getStrategyConfig(req.params.id);
      if (!config) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(config);
    } catch (error) {
      logger.error('Error getting strategy config:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateStrategyConfig(req: Request, res: Response): Promise<Response> {
    try {
      const { config } = req.body;
      const strategy = await this.strategyService.updateStrategyConfig(req.params.id, config);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      return res.json(strategy);
    } catch (error) {
      logger.error('Error updating strategy config:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllStrategies(req: Request, res: Response): Promise<Response> {
    try {
      const strategies = await this.strategyService.getAllStrategies();
      return res.json(strategies);
    } catch (error) {
      logger.error('Error getting all strategies:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async startStrategy(req: Request, res: Response): Promise<Response> {
    try {
      const strategy = await this.strategyService.getStrategyById(req.params.id);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      await this.strategyService.startStrategy(strategy);
      return res.json({ message: 'Strategy started successfully' });
    } catch (error) {
      logger.error('Error starting strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async stopStrategy(req: Request, res: Response): Promise<Response> {
    try {
      const strategy = await this.strategyService.getStrategyById(req.params.id);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      await this.strategyService.stopStrategy(strategy);
      return res.json({ message: 'Strategy stopped successfully' });
    } catch (error) {
      logger.error('Error stopping strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async pauseStrategy(req: Request, res: Response): Promise<Response> {
    try {
      const strategy = await this.strategyService.getStrategyById(req.params.id);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      await this.strategyService.pauseStrategy(strategy);
      return res.json({ message: 'Strategy paused successfully' });
    } catch (error) {
      logger.error('Error pausing strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async resumeStrategy(req: Request, res: Response): Promise<Response> {
    try {
      const strategy = await this.strategyService.getStrategyById(req.params.id);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      await this.strategyService.resumeStrategy(strategy);
      return res.json({ message: 'Strategy resumed successfully' });
    } catch (error) {
      logger.error('Error resuming strategy:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getStrategiesByUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const strategies = await this.strategyService.getStrategiesByUserId(new Types.ObjectId(req.user._id));
      return res.json(strategies);
    } catch (error) {
      logger.error('Error getting user strategies:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getActiveStrategies(req: Request, res: Response): Promise<Response> {
    try {
      const strategies = await this.strategyService.getActiveStrategies();
      return res.json(strategies);
    } catch (error) {
      logger.error('Error getting active strategies:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPopularStrategies(req: Request, res: Response): Promise<Response> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const strategies = await this.strategyService.getPopularStrategies(limit);
      return res.json(strategies);
    } catch (error) {
      logger.error('Error getting popular strategies:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 