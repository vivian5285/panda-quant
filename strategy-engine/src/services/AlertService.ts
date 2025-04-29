export class AlertService {
  private static instance: AlertService;

  private constructor() {}

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  async sendAlert(message: string): Promise<void> {
    // TODO: Implement alert sending logic
    console.log('Alert:', message);
  }
} 