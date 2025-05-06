import { Document, Types } from 'mongoose';

export interface IDepositNotification {
  userId: Types.ObjectId;
  depositId: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepositNotificationDocument extends Omit<IDepositNotification, '_id'>, Document {
  _id: Types.ObjectId;
}

export type DepositNotification = IDepositNotification;

export interface DepositNotificationCreateInput extends Omit<IDepositNotification, '_id' | 'createdAt' | 'updatedAt'> {}
export interface DepositNotificationUpdateInput extends Partial<DepositNotificationCreateInput> {} 