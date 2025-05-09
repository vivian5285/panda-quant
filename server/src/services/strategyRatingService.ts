import { Types } from 'mongoose';
import StrategyRating from '../models/strategy-rating.model';
import { IStrategyRating, IStrategyRatingDocument } from '../types/StrategyRating';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export class StrategyRatingService {
  private static instance: StrategyRatingService;

  private constructor() {}

  public static getInstance(): StrategyRatingService {
    if (!StrategyRatingService.instance) {
      StrategyRatingService.instance = new StrategyRatingService();
    }
    return StrategyRatingService.instance;
  }

  private convertToIStrategyRating(rating: IStrategyRatingDocument): IStrategyRating {
    const ratingObject = rating.toObject();
    return {
      ...ratingObject,
      _id: ratingObject._id.toString(),
      userId: ratingObject.userId.toString(),
      strategyId: ratingObject.strategyId.toString()
    } as IStrategyRating;
  }

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
      return this.convertToIStrategyRating(ratingDoc);
    } catch (error) {
      logger.error('Error creating rating:', error);
      throw new AppError('Failed to create rating', 500);
    }
  }

  async getStrategyRatings(strategyId: string): Promise<IStrategyRating[]> {
    try {
      const ratings = await StrategyRating.find({ strategyId: new Types.ObjectId(strategyId) });
      return ratings.map(this.convertToIStrategyRating);
    } catch (error) {
      logger.error('Error getting strategy ratings:', error);
      throw new AppError('Failed to get strategy ratings', 500);
    }
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