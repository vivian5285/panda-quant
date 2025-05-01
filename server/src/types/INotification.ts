import { Document } from 'mongoose';

export enum NotificationType {
  SYSTEM = 'system',
  TRADE = 'trade',
  STRATEGY = 'strategy',
  WITHDRAWAL = 'withdrawal',
  SETTLEMENT = 'settlement'
}

export interface INotification {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationDocument extends INotification, Document {} 