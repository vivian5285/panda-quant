import { AlertService } from './AlertService';
import { Types } from 'mongoose';
import { StrategyPerformance } from '../models/StrategyPerformance';

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

  async monitorStrategyPerformance(performance: InstanceType<typeof StrategyPerformance> & { _id: Types.ObjectId }) {
    const { userId, strategyId, profit } = performance;

    // 监控策略表现
    if (profit < 0) {
      await this.alertService.createAlert({
        userId: new Types.ObjectId(userId.toString()),
        type: 'strategy_loss',
        message: `策略 ${strategyId} 出现亏损`,
        data: {
          strategyId,
          profit
        }
      });
    }
  }
} 