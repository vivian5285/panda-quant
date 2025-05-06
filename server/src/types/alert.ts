import { Document, Types } from 'mongoose';

export interface IAlert extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'price' | 'volume' | 'technical' | 'strategy_loss' | 'news' | 'system';
  condition: string;
  value: number;
  status: 'active' | 'triggered' | 'disabled';
  exchange: string;
  symbol: string;
  timeframe?: string;
  triggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  metadata?: Record<string, any>;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
}

export interface IAlertNotification extends Document {
  _id: Types.ObjectId;
  alertId: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'email' | 'push' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlertStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredAlerts: number;
  disabledAlerts: number;
  monthlyStats: {
    month: string;
    alerts: number;
    triggers: number;
  }[];
  typeStats: {
    type: string;
    alerts: number;
    triggers: number;
  }[];
  userStats: {
    userId: string;
    alerts: number;
    triggers: number;
  }[];
}

export type Alert = IAlert;

export interface AlertCreateInput extends Omit<IAlert, '_id' | 'createdAt' | 'updatedAt'> {}
export interface AlertUpdateInput extends Partial<AlertCreateInput> {} 