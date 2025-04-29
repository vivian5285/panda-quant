import { UserLevel } from '../models/userLevel';
import { NotFoundError } from '../utils/errors';
import { Model } from 'mongoose';
import { IUserLevel } from '../interfaces/userLevel';

export class UserLevelService {
  private static instance: UserLevelService;
  private userLevelModel: Model<IUserLevel>;

  public static getInstance(): UserLevelService {
    if (!UserLevelService.instance) {
      UserLevelService.instance = new UserLevelService();
    }
    return UserLevelService.instance;
  }

  constructor() {
    this.userLevelModel = UserLevel;
  }

  // 获取所有用户等级
  async getLevels(): Promise<typeof UserLevel[]> {
    return UserLevel.find();
  }

  // 获取单个用户等级
  async getLevel(id: string): Promise<typeof UserLevel | null> {
    return UserLevel.findById(id);
  }

  // 创建用户等级
  async createLevel(data: {
    name: string;
    description: string;
    requirements: Record<string, any>;
    benefits: Record<string, any>;
  }): Promise<typeof UserLevel> {
    const level = new UserLevel(data);
    return level.save();
  }

  // 更新用户等级
  async updateLevel(id: string, data: Partial<typeof UserLevel>): Promise<typeof UserLevel | null> {
    return UserLevel.findByIdAndUpdate(id, data, { new: true });
  }

  // 删除用户等级
  async deleteLevel(id: string): Promise<typeof UserLevel | null> {
    return UserLevel.findByIdAndDelete(id);
  }
} 