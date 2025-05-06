import { Types } from 'mongoose';
import { UserLevel } from '../models/UserLevel';
import { IUserLevel } from '../types/UserLevel';

export class UserLevelService {
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
      _id: new Types.ObjectId()
    });
    return await userLevel.save();
  }

  async deleteUserLevel(id: string): Promise<boolean> {
    const result = await UserLevel.findByIdAndDelete(id);
    return result !== null;
  }
} 