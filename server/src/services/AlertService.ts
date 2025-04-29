export class AlertService {
  private static instance: AlertService;
  private alerts: Map<string, Alert>;

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  constructor() {
    this.alerts = new Map();
  }

  // ... existing code ...
} 