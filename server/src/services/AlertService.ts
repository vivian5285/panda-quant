import { IAlert } from '../interfaces/IAlert';
import { Types } from 'mongoose';

export class AlertService {
  private alerts: Map<string, IAlert> = new Map();

  async createAlert(alert: IAlert): Promise<IAlert> {
    const id = new Types.ObjectId().toString();
    const newAlert = { ...alert, id };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async getAlert(id: string): Promise<IAlert | undefined> {
    return this.alerts.get(id);
  }

  async updateAlert(id: string, alert: Partial<IAlert>): Promise<IAlert | undefined> {
    const existingAlert = this.alerts.get(id);
    if (!existingAlert) {
      return undefined;
    }

    const updatedAlert = { ...existingAlert, ...alert };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.alerts.delete(id);
  }

  async getAllAlerts(): Promise<IAlert[]> {
    return Array.from(this.alerts.values());
  }
} 