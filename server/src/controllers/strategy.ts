import { Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
import { logger } from '../utils/logger';
import { StrategyService } from '../services/StrategyService';

export class StrategyController {
  private strategyService: StrategyService;

  constructor() {
    this.strategyService = StrategyService.getInstance();
  }

  public getStrategies = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const strategies = await this.strategyService.getStrategies(req.user._id.toString());
      res.json(strategies);
    } catch (error) {
      logger.error('Error getting strategies:', error);
      res.status(500).json({ message: 'Error getting strategies', error: (error as Error).message });
    }
  };

  public getStrategy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const strategy = await this.strategyService.getStrategy(req.params['id']);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      res.json(strategy);
    } catch (error) {
      logger.error('Error getting strategy:', error);
      res.status(500).json({ message: 'Error getting strategy', error: (error as Error).message });
    }
  };

  public createStrategy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const strategy = await this.strategyService.createStrategy({
        ...req.body,
        userId: req.user._id.toString()
      });
      res.status(201).json({ message: 'Strategy created successfully', strategy });
    } catch (error) {
      logger.error('Error creating strategy:', error);
      res.status(500).json({ message: 'Error creating strategy', error });
    }
  };

  public updateStrategy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const strategy = await this.strategyService.updateStrategy(req.params['id'], req.body);
      if (!strategy) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      res.json({ message: 'Strategy updated successfully', strategy });
    } catch (error) {
      logger.error('Error updating strategy:', error);
      res.status(500).json({ message: 'Error updating strategy', error });
    }
  };

  public deleteStrategy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.strategyService.deleteStrategy(req.params['id']);
      if (result === null) {
        res.status(404).json({ message: 'Strategy not found' });
        return;
      }
      res.json({ message: 'Strategy deleted successfully' });
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      res.status(500).json({ message: 'Error deleting strategy', error });
    }
  };
}

const strategyController = new StrategyController();
export default strategyController; 