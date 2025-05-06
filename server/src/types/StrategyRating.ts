import { Document, Types } from 'mongoose';

export interface IStrategyRating {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyRatingDocument extends Omit<IStrategyRating, '_id'>, Document {
  _id: Types.ObjectId;
}

export interface IStrategyRatingService {
  getRatingsByStrategyId(strategyId: string): Promise<IStrategyRatingDocument[]>;
  getRatingById(id: string): Promise<IStrategyRatingDocument | null>;
  createRating(rating: IStrategyRating): Promise<IStrategyRatingDocument>;
  updateRating(id: string, rating: Partial<IStrategyRating>): Promise<IStrategyRatingDocument | null>;
  deleteRating(id: string): Promise<boolean>;
  getAverageRating(strategyId: string): Promise<number>;
} 