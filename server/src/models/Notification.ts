import { Schema, model } from 'mongoose';
import { INotification, NotificationType } from '../types/notification';

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'trade', 'system'] as NotificationType[],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const Notification = model<INotification>('Notification', notificationSchema); 