import { Types } from 'mongoose';
import { UserLevel } from '../models/User-level.model';
import { IUserLevel, IUserLevelDocument } from '../types/UserLevel';
import { logger } from '../utils/Logger';

export class UserLevelService {
  private static instance: UserLevelService;

  private constructor() {}

  public static getInstance(): UserLevelService {
    if (!UserLevelService.instance) {
      UserLevelService.instance = new UserLevelService();
    }
    return UserLevelService.instance;
  }

  private convertToIUserLevel(userLevel: IUserLevelDocument): IUserLevel {
    const userLevelObject = userLevel.toObject();
    return {
      ...userLevelObject,
      _id: userLevelObject._id.toString(),
      userId: userLevelObject.userId.toString()
    } as IUserLevel;
  }

  async getUserLevelById(id: string): Promise<IUserLevel | null> {
    return await UserLevel.findById(id);
  }

  async updateUserLevel(id: string, data: Partial<IUserLevel>): Promise<IUserLevel | null> {
    return await UserLevel.findByIdAndUpdate(id, data, { new: true });
  }

  async getAllUserLevels(): Promise<IUserLevel[]> {
    return await UserLevel.find();
  }

  async createUserLevel(data: Partial<IUserLevel>): Promise<IUserLevel> {
    const userLevel = new UserLevel({
      ...data,
      _id: new Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const savedUserLevel = await userLevel.save();
    return this.convertToIUserLevel(savedUserLevel);
  }

  async deleteUserLevel(id: string): Promise<boolean> {
    const result = await UserLevel.findByIdAndDelete(id);
    return result !== null;
  }
} 