import { Request, Response } from 'express';
import { StrategyRatingService } from '../services/strategyRatingService';
import { AuthRequest } from '../types';
import { Types } from 'mongoose';

const strategyRatingService = new StrategyRatingService();

export const strategyRatingController = {
  // 创建评价
  async createRating(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { strategyId, rating, comment } = req.body;

      // 检查用户是否已评价
      const hasRated = await strategyRatingService.hasUserRated(strategyId, req.user._id);
      if (hasRated) {
        return res.status(400).json({ message: '您已经评价过该策略' });
      }

      const newRating = await strategyRatingService.createRating({
        strategyId,
        userId: req.user._id,
        rating,
        comment
      });

      res.status(201).json(newRating);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  // 获取策略的所有评价
  async getStrategyRatings(req: Request, res: Response) {
    try {
      const { strategyId } = req.params;
      const ratings = await strategyRatingService.getRatingsByStrategy(strategyId);
      res.json(ratings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  // 获取用户的评价
  async getUserRatings(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const ratings = await strategyRatingService.getRatingsByUser(req.user._id);
      res.json(ratings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  // 获取策略的平均评分
  async getAverageRating(req: Request, res: Response) {
    try {
      const { strategyId } = req.params;
      const averageRating = await strategyRatingService.getAverageRating(strategyId);
      res.json({ averageRating });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  // 更新评价
  async updateRating(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { ratingId } = req.params;
      const { rating, comment } = req.body;

      // 验证用户是否有权限修改评价
      const existingRatings = await strategyRatingService.getRatingsByUser(req.user._id);
      const canUpdate = existingRatings.some(r => r._id.toString() === ratingId);
      
      if (!canUpdate) {
        return res.status(403).json({ message: '无权修改此评价' });
      }

      const updatedRating = await strategyRatingService.updateRating(ratingId, {
        rating,
        comment
      });

      res.json(updatedRating);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  // 删除评价
  async deleteRating(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { ratingId } = req.params;

      // 验证用户是否有权限删除评价
      const existingRatings = await strategyRatingService.getRatingsByUser(req.user._id);
      const canDelete = existingRatings.some(r => r._id.toString() === ratingId);
      
      if (!canDelete) {
        return res.status(403).json({ message: '无权删除此评价' });
      }

      await strategyRatingService.deleteRating(ratingId);
      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  // 获取所有评价
  async getRatings(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const ratings = await strategyRatingService.getAllRatings();
      res.json(ratings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
}; 