import { Model } from 'mongoose';
import { IStrategyRating } from '../interfaces/IStrategyRating';
import { StrategyRating } from '../models/StrategyRating';

export class StrategyRatingService {
  private static instance: StrategyRatingService;
  private strategyRatingModel: Model<IStrategyRating>;

  public static getInstance(): StrategyRatingService {
    if (!StrategyRatingService.instance) {
      StrategyRatingService.instance = new StrategyRatingService();
    }
    return StrategyRatingService.instance;
  }

  constructor() {
    this.strategyRatingModel = StrategyRating;
  }

  // 创建评价
  async createRating(data: Partial<IStrategyRating>): Promise<IStrategyRating> {
    return this.strategyRatingModel.create(data);
  }

  // 获取策略的所有评价
  async getRatings(strategyId: string): Promise<IStrategyRating[]> {
    return this.strategyRatingModel.find({ strategyId });
  }

  // 获取用户的评价
  async getUserRatings(userId: string): Promise<IStrategyRating[]> {
    return await StrategyRating.find({ userId })
      .populate('strategyId', 'name')
      .sort({ createdAt: -1 });
  }

  // 获取策略的平均评分
  async getAverageRating(strategyId: string): Promise<number> {
    const result = await StrategyRating.aggregate([
      { $match: { strategyId } },
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);
    return result[0]?.average || 0;
  }

  // 更新评价
  async updateRating(ratingId: string, updateData: Partial<IStrategyRating>): Promise<IStrategyRating | null> {
    return await StrategyRating.findByIdAndUpdate(
      ratingId,
      { $set: updateData },
      { new: true }
    );
  }

  // 删除评价
  async deleteRating(ratingId: string): Promise<IStrategyRating | null> {
    return await StrategyRating.findByIdAndDelete(ratingId);
  }

  // 检查用户是否已评价
  async hasUserRated(strategyId: string, userId: string): Promise<boolean> {
    const rating = await StrategyRating.findOne({ strategyId, userId });
    return !!rating;
  }
} 