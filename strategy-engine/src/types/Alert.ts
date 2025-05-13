import { AlertStatus, AlertType } from './Enums';

export interface IAlert {
  _id: string;
  userId: string;
  type: AlertType;
  status: AlertStatus;
  message: string;
  metadata?: {
    strategyId?: string;
    orderId?: string;
    price?: number;
    timestamp?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlertConfig {
  _id: string;
  userId: string;
  type: AlertType;
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  conditions: {
    price?: number;
    volume?: number;
    time?: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 