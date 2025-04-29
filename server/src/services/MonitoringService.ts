import { AlertService } from './AlertService';
import { Order } from '../types';

export class MonitoringService {
  private static instance: MonitoringService;
  private alertService: AlertService;

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  constructor() {
    this.alertService = AlertService.getInstance();
  }

  async createAlert(alertData: {
    ruleId: string;
    metric: string;
    value: number;
    threshold: number;
    severity: 'info' | 'warning' | 'critical';
    description: string;
    timestamp: number;
  }): Promise<void> {
    const alertMessage = JSON.stringify(alertData);
    await this.alertService.createAlert(alertMessage);
  }

  async monitorOrder(order: Order): Promise<void> {
    // Implementation of order monitoring
    // This is a placeholder for the actual monitoring logic
  }
} 