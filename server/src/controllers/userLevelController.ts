import { Request, Response } from 'express';
import { UserLevelService } from '../services/userLevelService';
import { validateUserLevel } from '../validators/userLevelValidator';
import { handleError } from '../utils/errorHandler';
import { Types } from 'mongoose';

const userLevelService = new UserLevelService();

export const userLevelController = {
  // 获取所有用户等级
  async getAllLevels(req: Request, res: Response) {
    try {
      const levels = await userLevelService.getLevels();
      res.json(levels);
    } catch (error: unknown) {
      handleError(res, error);
    }
  },

  // 获取单个用户等级
  async getLevelById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const level = await userLevelService.getLevel(new Types.ObjectId(id));
      res.json(level);
    } catch (error: unknown) {
      handleError(res, error);
    }
  },

  // 创建用户等级
  async createLevel(req: Request, res: Response) {
    try {
      const levelData = req.body;
      const validationError = validateUserLevel(levelData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const level = await userLevelService.createLevel(levelData);
      res.status(201).json(level);
    } catch (error: unknown) {
      handleError(res, error);
    }
  },

  // 更新用户等级
  async updateLevel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const levelData = req.body;
      const validationError = validateUserLevel(levelData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const level = await userLevelService.updateLevel(new Types.ObjectId(id), levelData);
      res.json(level);
    } catch (error: unknown) {
      handleError(res, error);
    }
  },

  // 删除用户等级
  async deleteLevel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userLevelService.deleteLevel(new Types.ObjectId(id));
      res.status(204).send();
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
}; 