import { Types } from 'mongoose';

export interface ILog {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  level: string;
  message: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILogDocument extends ILog {
  save(): Promise<ILogDocument>;
} 