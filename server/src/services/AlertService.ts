import { Model } from 'mongoose';
import { IAlert } from '../interfaces/IAlert';
import { Alert } from '../models/Alert';

export class AlertService {
  private static instance: AlertService;
  private alertModel: Model<IAlert>;

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  constructor() {
    this.alertModel = Alert;
  }

  async createAlert(data: Partial<IAlert>) {
    return this.alertModel.create(data);
  }

  async getAlerts(userId: string) {
    return this.alertModel.find({ userId });
  }

  async markAsRead(alertId: string) {
    return this.alertModel.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { new: true }
    );
  }
} 