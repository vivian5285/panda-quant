import { Types } from 'mongoose';
import { StrategyRating } from '../models/StrategyRating';
import { IStrategyRating } from '../types/strategyRating';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export class StrategyRatingService {
  async createRating(data: {
    userId: string;
    strategyId: string;
    rating: number;
    comment?: string;
  }): Promise<IStrategyRating> {
    try {
      const ratingDoc = new StrategyRating({
        ...data,
        userId: new Types.ObjectId(data.userId),
        strategyId: new Types.ObjectId(data.strategyId)
      });
      await ratingDoc.save();
      return ratingDoc;
    } catch (error) {
      logger.error('Error creating rating:', error);
      throw new AppError('Failed to create rating', 500);
    }
  }

  async getStrategyRatings(strategyId: string): Promise<IStrategyRating[]> {
    try {
      return await StrategyRating.find({ strategyId: new Types.ObjectId(strategyId) });
    } catch (error) {
      logger.error('Error getting strategy ratings:', error);
      throw new AppError('Failed to get strategy ratings', 500);
    }
  }

  async getUserRatings(userId: string): Promise<IStrategyRating[]> {
    try {
      return await StrategyRating.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      logger.error('Error getting user ratings:', error);
      throw new AppError('Failed to get user ratings', 500);
    }
  }

  async getAverageRating(strategyId: string): Promise<{ average: number; count: number }> {
    try {
      const result = await StrategyRating.aggregate([
        { $match: { strategyId: new Types.ObjectId(strategyId) } },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' },
            count: { $sum: 1 }
          }
        }
      ]);
      return result[0] || { average: 0, count: 0 };
    } catch (error) {
      logger.error('Error getting average rating:', error);
      throw new AppError('Failed to get average rating', 500);
    }
  }

  async updateRating(
    id: string,
    userId: string,
    data: { rating?: number; comment?: string }
  ): Promise<IStrategyRating | null> {
    try {
      return await StrategyRating.findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: { ...data, updatedAt: new Date() } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating rating:', error);
      throw new AppError('Failed to update rating', 500);
    }
  }

  async deleteRating(id: string, userId: string): Promise<boolean> {
    try {
      const result = await StrategyRating.deleteOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId)
      });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error('Error deleting rating:', error);
      throw new AppError('Failed to delete rating', 500);
    }
  }

  async getRatings(strategyId?: string): Promise<IStrategyRating[]> {
    try {
      const query = strategyId ? { strategyId: new Types.ObjectId(strategyId) } : {};
      return await StrategyRating.find(query);
    } catch (error) {
      logger.error('Error getting ratings:', error);
      throw new AppError('Failed to get ratings', 500);
    }
  }
} 