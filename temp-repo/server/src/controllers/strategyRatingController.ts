import { Request, Response } from 'express';
import { StrategyRatingService } from '../services/strategyRatingService';

const strategyRatingService = new StrategyRatingService();

export class StrategyRatingController {
  // 创建评价
  async createRating(req: Request, res: Response) {
    try {
      const { strategyId, rating, comment } = req.body;
      const userId = req.user._id; // 从认证中间件获取用户ID

      // 检查用户是否已评价
      const hasRated = await strategyRatingService.hasUserRated(strategyId, userId);
      if (hasRated) {
        return res.status(400).json({ message: '您已经评价过该策略' });
      }

      const newRating = await strategyRatingService.createRating({
        strategyId,
        userId,
        rating,
        comment
      });

      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ message: '创建评价失败', error });
    }
  }

  // 获取策略的所有评价
  async getStrategyRatings(req: Request, res: Response) {
    try {
      const { strategyId } = req.params;
      const ratings = await strategyRatingService.getStrategyRatings(strategyId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: '获取评价失败', error });
    }
  }

  // 获取用户的评价
  async getUserRatings(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const ratings = await strategyRatingService.getUserRatings(userId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: '获取评价失败', error });
    }
  }

  // 获取策略的平均评分
  async getAverageRating(req: Request, res: Response) {
    try {
      const { strategyId } = req.params;
      const averageRating = await strategyRatingService.getAverageRating(strategyId);
      res.json({ averageRating });
    } catch (error) {
      res.status(500).json({ message: '获取平均评分失败', error });
    }
  }

  // 更新评价
  async updateRating(req: Request, res: Response) {
    try {
      const { ratingId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user._id;

      // 验证用户是否有权限修改评价
      const existingRating = await strategyRatingService.getUserRatings(userId);
      const canUpdate = existingRating.some(r => r._id.toString() === ratingId);
      
      if (!canUpdate) {
        return res.status(403).json({ message: '无权修改此评价' });
      }

      const updatedRating = await strategyRatingService.updateRating(ratingId, {
        rating,
        comment
      });

      if (!updatedRating) {
        return res.status(404).json({ message: '评价不存在' });
      }

      res.json(updatedRating);
    } catch (error) {
      res.status(500).json({ message: '更新评价失败', error });
    }
  }

  // 删除评价
  async deleteRating(req: Request, res: Response) {
    try {
      const { ratingId } = req.params;
      const userId = req.user._id;

      // 验证用户是否有权限删除评价
      const existingRating = await strategyRatingService.getUserRatings(userId);
      const canDelete = existingRating.some(r => r._id.toString() === ratingId);
      
      if (!canDelete) {
        return res.status(403).json({ message: '无权删除此评价' });
      }

      const deletedRating = await strategyRatingService.deleteRating(ratingId);

      if (!deletedRating) {
        return res.status(404).json({ message: '评价不存在' });
      }

      res.json({ message: '评价已删除' });
    } catch (error) {
      res.status(500).json({ message: '删除评价失败', error });
    }
  }
} 