import UserLevelModel from '../models/UserLevel.model';
import { IUserLevel, IUserLevelDocument, UserLevelCreateInput, UserLevelUpdateInput } from '../types/User';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/Logger';
import { Types } from 'mongoose';

export class UserLevelService {
  private static instance: UserLevelService;

  private constructor() {}

  static getInstance(): UserLevelService {
    if (!UserLevelService.instance) {
      UserLevelService.instance = new UserLevelService();
    }
    return UserLevelService.instance;
  }

  async getAllLevels(): Promise<IUserLevel[]> {
    try {
      const levels = await UserLevelModel.find();
      return levels;
    } catch (error) {
      logger.error('Error getting all user levels:', error);
      throw new AppError('Failed to get user levels', 500);
    }
  }

  async getLevelById(id: string): Promise<IUserLevel | null> {
    try {
      const level = await UserLevelModel.findById(id);
      return level;
    } catch (error) {
      logger.error('Error getting user level by id:', error);
      throw new AppError('Failed to get user level', 500);
    }
  }

  async createLevel(data: UserLevelCreateInput): Promise<IUserLevel> {
    try {
      const level = new UserLevelModel(data);
      await level.save();
      return level;
    } catch (error) {
      logger.error('Error creating user level:', error);
      throw new AppError('Failed to create user level', 500);
    }
  }

  async updateLevel(id: string, data: UserLevelUpdateInput): Promise<IUserLevel | null> {
    try {
      const level = await UserLevelModel.findByIdAndUpdate(id, data, { new: true });
      return level;
    } catch (error) {
      logger.error('Error updating user level:', error);
      throw new AppError('Failed to update user level', 500);
    }
  }

  async deleteLevel(id: string): Promise<void> {
    try {
      await UserLevelModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting user level:', error);
      throw new AppError('Failed to delete user level', 500);
    }
  }

  async calculateUserLevel(amount: number): Promise<IUserLevel | null> {
    try {
      // 根据金额计算用户等级
      const levels = await this.getAllLevels();
      const appropriateLevel = levels.find(level => amount >= level.minDeposit);
      
      if (appropriateLevel) {
        return appropriateLevel;
      }
      
      return null;
    } catch (error) {
      logger.error('Error calculating user level:', error);
      throw new AppError('Failed to calculate user level', 500);
    }
  }
} 