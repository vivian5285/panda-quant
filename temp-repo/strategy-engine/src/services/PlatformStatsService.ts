import { CommissionService, CommissionRecord } from './CommissionService';
import { logger } from '../utils/logger';

export interface DailyStats {
  date: string;
  totalPlatformFee: number;
  totalTeamCommission: number;
  totalWithdrawals: number;
  activeUsers: number;
  totalTrades: number;
  totalProfit: number;
}

export class PlatformStatsService {
  private static instance: PlatformStatsService;
  private commissionService: CommissionService;
  private dailyStats: Map<string, DailyStats>;

  private constructor() {
    this.commissionService = CommissionService.getInstance();
    this.dailyStats = new Map();
  }

  public static getInstance(): PlatformStatsService {
    if (!PlatformStatsService.instance) {
      PlatformStatsService.instance = new PlatformStatsService();
    }
    return PlatformStatsService.instance;
  }

  public async calculateDailyStats(date: Date = new Date()): Promise<DailyStats> {
    const dateStr = this.formatDate(date);
    const records = this.commissionService.getCommissionRecords();

    const dailyRecords = records.filter(record => 
      this.formatDate(record.createdAt) === dateStr
    );

    const stats: DailyStats = {
      date: dateStr,
      totalPlatformFee: 0,
      totalTeamCommission: 0,
      totalWithdrawals: 0,
      activeUsers: new Set(dailyRecords.map(r => r.userId)).size,
      totalTrades: new Set(dailyRecords
        .filter(r => r.tradeId)
        .map(r => r.tradeId)
      ).size,
      totalProfit: 0
    };

    for (const record of dailyRecords) {
      switch (record.type) {
        case 'platform':
          stats.totalPlatformFee += record.amount;
          break;
        case 'team':
          stats.totalTeamCommission += record.amount;
          if (record.amount > 0) {
            stats.totalProfit += record.amount;
          }
          break;
        case 'withdrawal':
          stats.totalWithdrawals += Math.abs(record.amount);
          break;
      }
    }

    this.dailyStats.set(dateStr, stats);
    logger.info(`Calculated daily stats for ${dateStr}`);

    return stats;
  }

  public getDailyStats(date: string): DailyStats | undefined {
    return this.dailyStats.get(date);
  }

  public getStatsRange(startDate: string, endDate: string): DailyStats[] {
    const stats: DailyStats[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = this.formatDate(currentDate);
      const stat = this.dailyStats.get(dateStr);
      if (stat) {
        stats.push(stat);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return stats;
  }

  public getPlatformTotalStats(): {
    totalPlatformFee: number;
    totalTeamCommission: number;
    totalWithdrawals: number;
    totalUsers: number;
    totalTrades: number;
  } {
    const stats = {
      totalPlatformFee: 0,
      totalTeamCommission: 0,
      totalWithdrawals: 0,
      totalUsers: new Set<string>(),
      totalTrades: new Set<string>()
    };

    for (const dailyStat of this.dailyStats.values()) {
      stats.totalPlatformFee += dailyStat.totalPlatformFee;
      stats.totalTeamCommission += dailyStat.totalTeamCommission;
      stats.totalWithdrawals += dailyStat.totalWithdrawals;
      stats.totalUsers.add(dailyStat.date);
      stats.totalTrades.add(dailyStat.date);
    }

    return {
      ...stats,
      totalUsers: stats.totalUsers.size,
      totalTrades: stats.totalTrades.size
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 