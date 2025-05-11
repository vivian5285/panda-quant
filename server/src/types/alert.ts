import { Document, Types } from 'mongoose';

export interface IAlert {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlertDocument extends IAlert {
  save(): Promise<IAlertDocument>;
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