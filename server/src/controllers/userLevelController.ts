import { Request, Response } from 'express';
import { UserLevelService } from '../services/UserLevelService';
import { UserLevelCreateInput, UserLevelUpdateInput } from '../types/User';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/Logger';
import { AuthenticatedRequest } from '../types/Auth';
import { UserLevel } from '../types/Enums';

export class UserLevelController {
  private static instance: UserLevelController;
  private userLevelService: UserLevelService;

  public constructor() {
    this.userLevelService = UserLevelService.getInstance();
  }

  public static getInstance(): UserLevelController {
    if (!UserLevelController.instance) {
      UserLevelController.instance = new UserLevelController();
    }
    return UserLevelController.instance;
  }

  // 获取所有用户等级
  async getAllLevels(req: Request, res: Response): Promise<Response> {
    try {
      const levels = await this.userLevelService.getAllLevels();
      return res.json(levels);
    } catch (error) {
      logger.error('Error getting all user levels:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // 获取单个用户等级
  async getUserLevel(req: Request, res: Response): Promise<Response> {
    try {
      const level = await this.userLevelService.getLevelById(req.params.id);
      if (!level) {
        return res.status(404).json({ message: 'User level not found' });
      }
      return res.json(level);
    } catch (error) {
      logger.error('Error getting user level:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // 创建用户等级
  async createLevel(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const level = await this.userLevelService.createLevel(req.body);
      return res.status(201).json(level);
    } catch (error) {
      logger.error('Error creating user level:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // 更新用户等级
  async updateLevel(req: Request, res: Response): Promise<Response> {
    try {
      const level = await this.userLevelService.updateLevel(req.params.id, req.body);
      if (!level) {
        return res.status(404).json({ message: 'User level not found' });
      }
      return res.json(level);
    } catch (error) {
      logger.error('Error updating user level:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // 删除用户等级
  async deleteLevel(req: Request, res: Response): Promise<Response> {
    try {
      await this.userLevelService.deleteLevel(req.params.id);
      return res.status(204).send();
    } catch (error) {
      logger.error('Error deleting user level:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async addExperience(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = req.user._id.toString();
      const { amount } = req.body;
      const calculatedLevel = Math.floor(Number(amount) / 1000) + 1;
      
      // 根据计算出的等级确定对应的 UserLevel
      let level: UserLevel;
      if (calculatedLevel >= 5) {
        level = UserLevel.DIAMOND;
      } else if (calculatedLevel >= 4) {
        level = UserLevel.PLATINUM;
      } else if (calculatedLevel >= 3) {
        level = UserLevel.GOLD;
      } else if (calculatedLevel >= 2) {
        level = UserLevel.SILVER;
      } else {
        level = UserLevel.BRONZE;
      }

      const updatedUserLevel = await this.userLevelService.updateLevel(userId, { level });
      if (!updatedUserLevel) {
        return res.status(404).json({ message: 'User level not found' });
      }
      return res.json(updatedUserLevel);
    } catch (error) {
      logger.error('Error adding experience:', error);
      return res.status(500).json({ message: 'Error adding experience' });
    }
  }

  async getUserLevelInfo(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = req.user._id.toString();
      const levelInfo = await this.userLevelService.getLevelById(userId);
      if (!levelInfo) {
        return res.status(404).json({ message: 'User level not found' });
      }
      return res.json(levelInfo);
    } catch (error) {
      logger.error('Error getting user level info:', error);
      return res.status(500).json({ message: 'Error getting user level info' });
    }
  }

  async calculateUserLevel(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;
      const { level } = req.body;

      if (!Object.values(UserLevel).includes(level)) {
        throw new AppError('Invalid level value', 400);
      }

      const userLevel = await this.userLevelService.updateLevel(userId, { level });
      
      if (!userLevel) {
        return res.status(404).json({ message: 'User level not found' });
      }

      return res.json(userLevel);
    } catch (error) {
      logger.error('Error calculating user level:', error);
      return res.status(500).json({ message: 'Failed to calculate user level' });
    }
  }

  async addPoints(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;
      const { points } = req.body;

      if (typeof points !== 'number') {
        throw new AppError('Invalid points value', 400);
      }

      // 根据积分计算用户等级
      let level: UserLevel;
      if (points >= 10000) {
        level = UserLevel.DIAMOND;
      } else if (points >= 5000) {
        level = UserLevel.PLATINUM;
      } else if (points >= 2000) {
        level = UserLevel.GOLD;
      } else if (points >= 1000) {
        level = UserLevel.SILVER;
      } else {
        level = UserLevel.BRONZE;
      }

      const userLevel = await this.userLevelService.updateLevel(userId, { level });
      
      if (!userLevel) {
        return res.status(404).json({ message: 'User level not found' });
      }

      return res.json(userLevel);
    } catch (error) {
      logger.error('Error adding points:', error);
      return res.status(500).json({ message: 'Failed to add points' });
    }
  }
} 