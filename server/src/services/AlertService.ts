import { Types } from 'mongoose';
import { Alert } from '../models/Alert.model';
import { IAlert, IAlertDocument } from '../types/Alert';
import { logger } from '../utils/Logger';

export class AlertService {
  private static instance: AlertService;

  private constructor() {}

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  async createAlert(alertData: Omit<IAlert, '_id'>): Promise<IAlert> {
    try {
      const alert = new Alert(alertData);
      const savedAlert = await alert.save();
      return this.convertToIAlert(savedAlert);
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }

  private convertToIAlert(alert: IAlertDocument): IAlert {
    return {
      _id: alert._id,
      userId: alert.userId,
      strategyId: alert.strategyId,
      type: alert.type,
      message: alert.message,
      status: alert.status,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt
    };
  }

  async getAlertById(id: string): Promise<IAlert | null> {
    try {
      const alert = await Alert.findById(id);
      return alert ? this.convertToIAlert(alert) : null;
    } catch (error) {
      logger.error('Error getting alert:', error);
      throw error;
    }
  }

  async getAlertsByUserId(userId: string): Promise<IAlert[]> {
    try {
      const alerts = await Alert.find({ userId: new Types.ObjectId(userId) });
      return alerts.map(alert => this.convertToIAlert(alert));
    } catch (error) {
      logger.error('Error getting alerts by user id:', error);
      throw error;
    }
  }

  async getAlertsByStrategyId(strategyId: string): Promise<IAlert[]> {
    try {
      const alerts = await Alert.find({ strategyId: new Types.ObjectId(strategyId) });
      return alerts.map(alert => this.convertToIAlert(alert));
    } catch (error) {
      logger.error('Error getting alerts by strategy id:', error);
      throw error;
    }
  }

  async updateAlert(id: string, data: Partial<IAlert>): Promise<IAlert | null> {
    try {
      const alert = await Alert.findByIdAndUpdate(id, data, { new: true });
      return alert ? this.convertToIAlert(alert) : null;
    } catch (error) {
      logger.error('Error updating alert:', error);
      throw error;
    }
  }

  async deleteAlert(id: string): Promise<boolean> {
    try {
      const result = await Alert.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting alert:', error);
      throw error;
    }
  }

  async updateAlertStatus(id: string, status: string): Promise<IAlert | null> {
    try {
      const alert = await Alert.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return alert ? this.convertToIAlert(alert) : null;
    } catch (error) {
      logger.error('Error updating alert status:', error);
      throw error;
    }
  }
} 