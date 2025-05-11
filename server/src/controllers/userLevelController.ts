import { Request, Response } from 'express';
import { UserLevelService } from '../services/UserLevelService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types/Auth';
import { AppError } from '../utils/AppError';

export class UserLevelController {
  private userLevelService: UserLevelService;

  constructor() {
    this.userLevelService = UserLevelService.getInstance();
  }

  // 获取所有用户等级
  async getAllLevels(_req: Request, res: Response): Promise<void> {
    try {
      const levels = await this.userLevelService.getAllUserLevels();
      res.json(levels);
    } catch (error) {
      logger.error('Error getting all levels:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 获取单个用户等级
  async getUserLevel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userId = req.user._id.toString();
      const userLevel = await this.userLevelService.getUserLevelById(userId);
      res.json(userLevel);
    } catch (error) {
      res.status(500).json({ message: 'Error getting user level', error });
    }
  }

  // 创建用户等级
  async createLevel(req: Request, res: Response): Promise<void> {
    try {
      const level = await this.userLevelService.createUserLevel(req.body);
      res.status(201).json(level);
    } catch (error) {
      logger.error('Error creating level:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 更新用户等级
  async updateLevel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const level = await this.userLevelService.updateUserLevel(id, req.body);
      if (!level) {
        res.status(404).json({ error: 'Level not found' });
        return;
      }
      res.json(level);
    } catch (error) {
      logger.error('Error updating level:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 删除用户等级
  async deleteLevel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.userLevelService.deleteUserLevel(id);
      if (!success) {
        res.status(404).json({ message: 'User level not found' });
        return;
      }
      res.status(204).send({});
    } catch (error) {
      logger.error('Error deleting level:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userId = req.user._id.toString();
      const { amount } = req.body;
      const updatedUserLevel = await this.userLevelService.updateUserLevel(userId, { experience: amount });
      res.json(updatedUserLevel);
    } catch (error) {
      res.status(500).json({ message: 'Error adding experience', error });
    }
  }

  async getUserLevelInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userId = req.user._id.toString();
      const levelInfo = await this.userLevelService.getUserLevelById(userId);
      res.json(levelInfo);
    } catch (error) {
      res.status(500).json({ message: 'Error getting user level info', error });
    }
  }
} 