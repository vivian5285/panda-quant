import { Types } from 'mongoose';
import { Activity } from '../models/Activity.model';
import { IActivity, IActivityDocument } from '../types/Activity';
import { logger } from '../utils/Logger';

export class ActivityService {
  private static instance: ActivityService;

  private constructor() {}

  public static getInstance(): ActivityService {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService();
    }
    return ActivityService.instance;
  }

  private convertToIActivity(activity: IActivityDocument): IActivity {
    return {
      _id: activity._id as Types.ObjectId,
      userId: activity.userId,
      type: activity.type,
      description: activity.description,
      data: activity.data,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt
    };
  }

  async createActivity(activityData: Partial<IActivity>): Promise<IActivity> {
    try {
      const activity = new Activity(activityData);
      const savedActivity = await activity.save();
      return this.convertToIActivity(savedActivity);
    } catch (error) {
      logger.error('Error creating activity:', error);
      throw error;
    }
  }

  async getActivityById(id: string): Promise<IActivity | null> {
    try {
      const activity = await Activity.findById(id);
      return activity ? this.convertToIActivity(activity) : null;
    } catch (error) {
      logger.error('Error getting activity:', error);
      throw error;
    }
  }

  async getActivitiesByUserId(userId: string): Promise<IActivity[]> {
    try {
      const activities = await Activity.find({ userId: new Types.ObjectId(userId) });
      return activities.map(activity => this.convertToIActivity(activity));
    } catch (error) {
      logger.error('Error getting activities by user id:', error);
      throw error;
    }
  }

  async getActivitiesByType(type: string): Promise<IActivity[]> {
    try {
      const activities = await Activity.find({ type });
      return activities.map((activity: IActivityDocument) => this.convertToIActivity(activity));
    } catch (error) {
      logger.error('Error getting activities by type:', error);
      throw error;
    }
  }

  async updateActivity(id: string, data: Partial<IActivity>): Promise<IActivity | null> {
    try {
      const activity = await Activity.findByIdAndUpdate(id, data, { new: true });
      return activity ? this.convertToIActivity(activity) : null;
    } catch (error) {
      logger.error('Error updating activity:', error);
      throw error;
    }
  }

  async deleteActivity(id: string): Promise<boolean> {
    try {
      const result = await Activity.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting activity:', error);
      throw error;
    }
  }

  async clearOldActivities(days: number): Promise<number> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);
      const result = await Activity.deleteMany({ createdAt: { $lt: date } });
      return result.deletedCount || 0;
    } catch (error) {
      logger.error('Error clearing old activities:', error);
      throw error;
    }
  }
} 