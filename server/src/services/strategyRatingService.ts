import { Types } from 'mongoose';
import { StrategyRating } from '../models/StrategyRating.model';
import { IStrategyRating, IStrategyRatingDocument } from '../types/Strategy';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class StrategyRatingService {
  private static instance: StrategyRatingService;

  private constructor() {}

  public static getInstance(): StrategyRatingService {
    if (!StrategyRatingService.instance) {
      StrategyRatingService.instance = new StrategyRatingService();
    }
    return StrategyRatingService.instance;
  }

  async createRating(ratingData: Omit<IStrategyRating, '_id'>): Promise<IStrategyRating> {
    try {
      const rating = new StrategyRating(ratingData);
      const savedRating = await rating.save();
      return this.convertToIStrategyRating(savedRating);
    } catch (error) {
      logger.error('Error creating strategy rating:', error);
      throw error;
    }
  }

  async getRatingById(id: string): Promise<IStrategyRating | null> {
    try {
      const rating = await StrategyRating.findById(id);
      return rating ? this.convertToIStrategyRating(rating) : null;
    } catch (error) {
      logger.error('Error getting strategy rating:', error);
      throw error;
    }
  }

  async getRatingsByStrategyId(strategyId: string): Promise<IStrategyRating[]> {
    try {
      const ratings = await StrategyRating.find({ strategyId: new Types.ObjectId(strategyId) });
      return ratings.map(rating => this.convertToIStrategyRating(rating));
    } catch (error) {
      logger.error('Error getting strategy ratings:', error);
      throw error;
    }
  }

  private convertToIStrategyRating(rating: IStrategyRatingDocument): IStrategyRating {
    return {
      _id: rating._id,
      strategyId: rating.strategyId,
      userId: rating.userId,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt
    };
  }

  async getUserRatings(userId: string): Promise<IStrategyRating[]> {
    try {
      const ratings = await StrategyRating.find({ userId: new Types.ObjectId(userId) });
      return ratings.map(this.convertToIStrategyRating);
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
      const updatedRating = await StrategyRating.findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: { ...data, updatedAt: new Date() } },
        { new: true }
      );
      return updatedRating ? this.convertToIStrategyRating(updatedRating) : null;
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
      const ratings = await StrategyRating.find(query);
      return ratings.map(this.convertToIStrategyRating);
    } catch (error) {
      logger.error('Error getting ratings:', error);
      throw new AppError('Failed to get ratings', 500);
    }
  }
} 