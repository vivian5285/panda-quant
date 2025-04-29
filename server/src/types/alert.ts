import { Types } from 'mongoose';

export interface IAlert {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AlertCreateInput = Omit<IAlert, '_id' | 'createdAt' | 'updatedAt'>;
export type AlertUpdateInput = Partial<AlertCreateInput>; 