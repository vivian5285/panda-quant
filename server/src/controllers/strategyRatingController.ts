import { Request, Response } from 'express';
import { StrategyRatingService } from '../services/StrategyRatingService';
import { AuthenticatedRequest } from '../types/Express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export class StrategyRatingController {
  private strategyRatingService: StrategyRatingService;

  constructor() {
    this.strategyRatingService = StrategyRatingService.getInstance();
  }

  public async createRating(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const rating = await this.strategyRatingService.createRating({
        ...req.body,
        userId: req.user._id
      });
      res.status(201).json(rating);
    } catch (error) {
      logger.error('Error creating strategy rating:', error);
      res.status(500).json({ message: 'Error creating strategy rating' });
    }
  }

  public async getRatings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const ratings = await this.strategyRatingService.getRatings(req.user._id.toString());
      res.json(ratings);
    } catch (error) {
      logger.error('Error getting strategy ratings:', error);
      res.status(500).json({ message: 'Error getting strategy ratings' });
    }
  }

  public async updateRating(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const rating = await this.strategyRatingService.updateRating(
        req.params['id'],
        req.user._id.toString(),
        {
          rating: req.body.rating,
          comment: req.body.comment
        }
      );
      res.json(rating);
    } catch (error) {
      logger.error('Error updating strategy rating:', error);
      res.status(500).json({ message: 'Error updating strategy rating' });
    }
  }

  public async deleteRating(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      await this.strategyRatingService.deleteRating(
        req.params['id'],
        req.user._id.toString()
      );
      res.json({ message: 'Strategy rating deleted successfully' });
    } catch (error) {
      logger.error('Error deleting strategy rating:', error);
      res.status(500).json({ message: 'Error deleting strategy rating' });
    }
  }
} 