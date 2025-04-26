import { DepositNotification, LargeDepositAlert } from '../types/deposit';
import { logger } from '../utils/logger';
import { Database } from '../database';

export class NotificationService {
  private static instance: NotificationService;
  private db: Database;

  private constructor() {
    this.db = Database.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async sendInAppNotification(notification: DepositNotification): Promise<void> {
    try {
      // 保存到数据库
      await this.db.saveNotification(notification);
      
      // 发送实时通知
      // TODO: 实现实时通知推送
      
      logger.info(`Sent in-app notification to user ${notification.userId}`);
    } catch (error) {
      logger.error('Error sending in-app notification:', error);
      throw error;
    }
  }

  public async notifyAdmins(alert: LargeDepositAlert): Promise<void> {
    try {
      // 获取所有管理员
      const admins = await this.db.getAdmins();
      
      // 发送通知给每个管理员
      for (const admin of admins) {
        await this.sendAdminNotification(admin.id, alert);
      }
      
      logger.info('Sent large deposit alert to admins');
    } catch (error) {
      logger.error('Error notifying admins:', error);
      throw error;
    }
  }

  public async recordToRiskSystem(deposit: Deposit): Promise<void> {
    try {
      // 记录到风控系统
      await this.db.recordRiskEvent({
        type: 'large_deposit',
        userId: deposit.userId,
        amount: deposit.amount,
        timestamp: new Date()
      });
      
      logger.info(`Recorded large deposit to risk system for user ${deposit.userId}`);
    } catch (error) {
      logger.error('Error recording to risk system:', error);
      throw error;
    }
  }

  private async sendAdminNotification(adminId: string, alert: LargeDepositAlert): Promise<void> {
    // TODO: 实现管理员通知发送
  }
} 