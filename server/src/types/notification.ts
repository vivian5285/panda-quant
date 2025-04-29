import { Types } from 'mongoose';

export interface INotification {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NotificationCreateInput = Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>;
export type NotificationUpdateInput = Partial<NotificationCreateInput>; 