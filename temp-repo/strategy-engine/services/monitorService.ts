import { DatabaseService } from '../../user-api/services/databaseService';
import { Strategy } from '../types';

export class MonitorService {
  private databaseService: DatabaseService;
  private checkInterval: NodeJS.Timeout | null;

  constructor() {
    this.databaseService = new DatabaseService();
    this.checkInterval = null;
  }

  public async addMonitor(
    strategyId: string,
    type: 'profit' | 'drawdown' | 'winrate',
    threshold: number
  ): Promise<number> {
    const result = await this.databaseService.query(
      'INSERT INTO strategy_monitors (strategy_id, type, threshold) VALUES ($1, $2, $3) RETURNING id',
      [strategyId, type, threshold]
    );
    return result.rows[0].id;
  }

  public async removeMonitor(monitorId: number): Promise<void> {
    await this.databaseService.query('DELETE FROM strategy_monitors WHERE id = $1', [monitorId]);
  }

  public async updateMonitor(monitorId: number, threshold: number): Promise<void> {
    await this.databaseService.query(
      'UPDATE strategy_monitors SET threshold = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [threshold, monitorId]
    );
  }

  public async toggleMonitor(monitorId: number, isActive: boolean): Promise<void> {
    await this.databaseService.query(
      'UPDATE strategy_monitors SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [isActive, monitorId]
    );
  }

  public async checkStrategy(strategy: Strategy): Promise<void> {
    const stats = strategy.getStats();
    const monitors = await this.databaseService.query(
      'SELECT * FROM strategy_monitors WHERE strategy_id = $1 AND is_active = true',
      [strategy.constructor.name]
    );

    for (const monitor of monitors.rows) {
      let shouldAlert = false;
      let value = 0;
      let message = '';

      switch (monitor.type) {
        case 'profit':
          value = stats.totalProfit;
          shouldAlert = value < monitor.threshold;
          message = `策略 ${strategy.constructor.name} 总收益 ${value} 低于阈值 ${monitor.threshold}`;
          break;
        case 'drawdown':
          value = stats.maxDrawdown;
          shouldAlert = value > monitor.threshold;
          message = `策略 ${strategy.constructor.name} 最大回撤 ${value}% 超过阈值 ${monitor.threshold}%`;
          break;
        case 'winrate':
          value = stats.winRate;
          shouldAlert = value < monitor.threshold;
          message = `策略 ${strategy.constructor.name} 胜率 ${value}% 低于阈值 ${monitor.threshold}%`;
          break;
      }

      if (shouldAlert) {
        await this.createAlert(strategy.constructor.name, monitor.id, monitor.type, value, monitor.threshold, message);
      }
    }
  }

  public startMonitoring(strategies: Map<string, Strategy>): void {
    if (this.checkInterval) {
      return;
    }

    this.checkInterval = setInterval(async () => {
      for (const [_, strategy] of strategies) {
        try {
          await this.checkStrategy(strategy);
        } catch (error) {
          console.error('策略监控失败:', error);
        }
      }
    }, 60000); // 每分钟检查一次
  }

  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async createAlert(
    strategyId: string,
    monitorId: number,
    type: string,
    value: number,
    threshold: number,
    message: string
  ): Promise<void> {
    await this.databaseService.query(
      'INSERT INTO alerts (strategy_id, monitor_id, type, value, threshold, message) VALUES ($1, $2, $3, $4, $5, $6)',
      [strategyId, monitorId, type, value, threshold, message]
    );
  }

  public async getAlerts(strategyId?: string, isRead?: boolean): Promise<any[]> {
    let query = 'SELECT * FROM alerts';
    const params: any[] = [];
    let paramIndex = 1;

    if (strategyId || isRead !== undefined) {
      query += ' WHERE';
      if (strategyId) {
        query += ` strategy_id = $${paramIndex++}`;
        params.push(strategyId);
      }
      if (isRead !== undefined) {
        if (params.length > 0) {
          query += ' AND';
        }
        query += ` is_read = $${paramIndex++}`;
        params.push(isRead);
      }
    }

    query += ' ORDER BY created_at DESC';
    const result = await this.databaseService.query(query, params);
    return result.rows;
  }

  public async markAlertAsRead(alertId: number): Promise<void> {
    await this.databaseService.query('UPDATE alerts SET is_read = true WHERE id = $1', [alertId]);
  }

  public async markAllAlertsAsRead(strategyId?: string): Promise<void> {
    if (strategyId) {
      await this.databaseService.query(
        'UPDATE alerts SET is_read = true WHERE strategy_id = $1',
        [strategyId]
      );
    } else {
      await this.databaseService.query('UPDATE alerts SET is_read = true');
    }
  }
} 