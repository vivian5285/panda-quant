import { Document } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  userId: string;
  type: 'trade' | 'deposit' | 'withdrawal' | 'commission' | 'alert';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type Notification = INotification;

export interface NotificationCreateInput extends Omit<INotification, '_id' | 'createdAt' | 'updatedAt'> {}
export interface NotificationUpdateInput extends Partial<NotificationCreateInput> {} 