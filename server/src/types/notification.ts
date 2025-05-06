import { Document, Types } from 'mongoose';

export type NotificationType = 'trade' | 'deposit' | 'withdrawal' | 'commission' | 'alert' | 'admin' | 'risk';

export interface IDepositNotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  userId: Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationDocument extends Omit<INotification, '_id'>, Document {
  _id: Types.ObjectId;
}

export type Notification = INotification;

export interface NotificationCreateInput extends Omit<INotification, '_id' | 'createdAt' | 'updatedAt'> {}
export interface NotificationUpdateInput extends Partial<NotificationCreateInput> {} 