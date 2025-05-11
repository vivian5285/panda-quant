import { Document, Types } from 'mongoose';

export type ActivityType = 'LOGIN' | 'LOGOUT' | 'TRADE' | 'WITHDRAW' | 'DEPOSIT' | 'API_KEY' | 'SETTINGS' | 'OTHER';

export interface IActivity {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: ActivityType;
  description: string;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityDocument extends IActivity {
  save(): Promise<IActivityDocument>;
} 