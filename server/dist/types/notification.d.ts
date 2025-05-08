/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
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
export interface NotificationCreateInput extends Omit<INotification, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface NotificationUpdateInput extends Partial<NotificationCreateInput> {
}
//# sourceMappingURL=Notification.d.ts.map