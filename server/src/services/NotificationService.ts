import { Types } from 'mongoose';
import { Notification } from '../models/Notification.model';
import { INotification, INotificationDocument, NotificationCreateInput, NotificationUpdateInput } from '../types/Notification';
import { logger } from '../utils/Logger';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private convertToINotification(notification: INotificationDocument): INotification {
    return {
      _id: notification._id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    };
  }

  async createNotification(notificationData: NotificationCreateInput): Promise<INotification> {
    try {
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();
      return this.convertToINotification(savedNotification);
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  async getNotificationById(id: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findById(id);
      return notification ? this.convertToINotification(notification) : null;
    } catch (error) {
      logger.error('Error getting notification:', error);
      throw error;
    }
  }

  async getNotificationsByUserId(userId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({ userId: new Types.ObjectId(userId) });
      return notifications.map(notification => this.convertToINotification(notification));
    } catch (error) {
      logger.error('Error getting notifications:', error);
      throw error;
    }
  }

  async updateNotification(id: string, data: NotificationUpdateInput): Promise<INotification | null> {
    try {
      const notification = await Notification.findByIdAndUpdate(id, data, { new: true });
      return notification ? this.convertToINotification(notification) : null;
    } catch (error) {
      logger.error('Error updating notification:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    try {
      const result = await Notification.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      return notification ? this.convertToINotification(notification) : null;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { userId: new Types.ObjectId(userId), isRead: false },
        { isRead: true, updatedAt: new Date() }
      );
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
} 