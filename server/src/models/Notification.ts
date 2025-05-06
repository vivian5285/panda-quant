import mongoose, { Schema } from 'mongoose';
import { INotification, INotificationDocument } from '../types/Notification';

const notificationSchema = new Schema<INotificationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
export default Notification; 