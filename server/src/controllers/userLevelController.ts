import { Request, Response } from 'express';
import { UserLevelService } from '../services/userLevelService';
import { validateUserLevel } from '../validators/userLevelValidator';
import { handleError } from '../utils/errorHandler';
import { Types } from 'mongoose';
import { UserLevel } from '../models/userLevel';
import { IUserLevel } from '../interfaces/IUserLevel';

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
      const { name, description, requirements } = req.body;
      const newLevel = new UserLevel({
        name,
        description,
        requirements
      });

      const savedLevel = await newLevel.save();
      return res.status(201).json(savedLevel);
    } catch (error) {
      console.error('Error creating level:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 更新用户等级
  async updateLevel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, requirements } = req.body;

      const updatedLevel = await UserLevel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { name, description, requirements },
        { new: true }
      );

      if (!updatedLevel) {
        return res.status(404).json({ message: 'Level not found' });
      }

      return res.json(updatedLevel);
    } catch (error) {
      console.error('Error updating level:', error);
      return res.status(500).json({ message: 'Internal server error' });
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
  },

  async getLevel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const level = await UserLevel.findById(new Types.ObjectId(id));

      if (!level) {
        return res.status(404).json({ message: 'Level not found' });
      }

      return res.json(level);
    } catch (error) {
      console.error('Error getting level:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}; 