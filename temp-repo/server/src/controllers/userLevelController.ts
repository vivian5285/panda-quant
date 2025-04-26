import { Request, Response } from 'express';
import { userLevelService } from '../services/userLevelService';
import { validateUserLevel } from '../validators/userLevelValidator';
import { handleError } from '../utils/errorHandler';

export const userLevelController = {
  // 获取所有用户等级
  async getAllLevels(req: Request, res: Response) {
    try {
      const levels = await userLevelService.getAllLevels();
      res.json(levels);
    } catch (error) {
      handleError(res, error);
    }
  },

  // 获取单个用户等级
  async getLevelById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const level = await userLevelService.getLevelById(id);
      res.json(level);
    } catch (error) {
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
    } catch (error) {
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

      const level = await userLevelService.updateLevel(id, levelData);
      res.json(level);
    } catch (error) {
      handleError(res, error);
    }
  },

  // 删除用户等级
  async deleteLevel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userLevelService.deleteLevel(id);
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  }
}; 