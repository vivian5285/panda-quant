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
export interface INotification extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'trade' | 'system';
    title: string;
    message: string;
    read: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export type Notification = INotification;
export interface NotificationCreateInput extends Omit<INotification, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface NotificationUpdateInput extends Partial<NotificationCreateInput> {
}
