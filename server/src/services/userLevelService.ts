import { UserLevel } from '../models/userLevel';
import { NotFoundError } from '../utils/errors';

export const userLevelService = {
  // 获取所有用户等级
  async getAllLevels(): Promise<UserLevel[]> {
    return await UserLevel.find().sort({ createdAt: -1 });
  },

  // 获取单个用户等级
  async getLevelById(id: string): Promise<UserLevel> {
    const level = await UserLevel.findById(id);
    if (!level) {
      throw new NotFoundError('User level not found');
    }
    return level;
  },

  // 创建用户等级
  async createLevel(levelData: Partial<UserLevel>): Promise<UserLevel> {
    const level = new UserLevel(levelData);
    return await level.save();
  },

  // 更新用户等级
  async updateLevel(id: string, levelData: Partial<UserLevel>): Promise<UserLevel> {
    const level = await UserLevel.findByIdAndUpdate(
      id,
      { ...levelData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!level) {
      throw new NotFoundError('User level not found');
    }
    return level;
  },

  // 删除用户等级
  async deleteLevel(id: string): Promise<void> {
    const level = await UserLevel.findByIdAndDelete(id);
    if (!level) {
      throw new NotFoundError('User level not found');
    }
  }
}; 