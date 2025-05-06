import { Document, Types } from 'mongoose';

export interface IUserLevel {
  name: string;
  level: number;
  minDeposit: number;
  maxDeposit: number;
  commissionRate: number;
  experience: number;
  requiredExperience: number;
  minCommission: number;
  maxCommission: number;
  benefits: string[];
  achievements: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLevelDocument extends Omit<IUserLevel, '_id'>, Document {
  _id: Types.ObjectId;
}

export interface IUserLevelService {
  createUserLevel(data: Partial<IUserLevel>): Promise<IUserLevelDocument>;
  getUserLevelById(id: string): Promise<IUserLevelDocument | null>;
  updateUserLevel(id: string, data: Partial<IUserLevel>): Promise<IUserLevelDocument | null>;
  deleteUserLevel(id: string): Promise<boolean>;
  getAllUserLevels(): Promise<IUserLevelDocument[]>;
  getUserLevelByExperience(experience: number): Promise<IUserLevelDocument | null>;
} 