import { Server } from 'socket.io';
import { Types } from 'mongoose';
import { NotificationService } from './NotificationService';
import { Deposit } from '../models/Deposit';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export class DepositNotificationService {
  private static instance: DepositNotificationService;
  private io: Server;
  private notificationService: NotificationService;
  private largeDepositThreshold = 10000;

  public static getInstance(): DepositNotificationService {
    if (!DepositNotificationService.instance) {
      DepositNotificationService.instance = new DepositNotificationService();
    }
    return DepositNotificationService.instance;
  }

  constructor() {
    this.io = new Server();
    this.notificationService = NotificationService.getInstance();
  }

  setupWebSocketServer(server: any) {
    this.io = new Server(server);
  }

  async notifyDeposit(deposit: InstanceType<typeof Deposit> & { _id: Types.ObjectId }) {
    const { userId, amount, status } = deposit;
    
    this.io.to(userId.toString()).emit('deposit', {
      userId,
      amount,
      status
    });
  }

  private async handleDeposit(deposit: Deposit) {
    try {
      // 广播充值通知
      this.broadcastDeposit(deposit);
      
      // 发送应用内通知
      await this.notificationService.sendInAppNotification({
        userId: deposit.userId,
        type: 'deposit',
        message: `收到${deposit.amount} USDT充值`,
        data: deposit
      });

      // 检查是否为大额充值
      if (deposit.amount > this.largeDepositThreshold) {
        await this.handleLargeDeposit(deposit);
      }

      // 触发事件
      this.emit('depositReceived', deposit);
    } catch (error) {
      logger.error('Error handling deposit:', error);
    }
  }

  private broadcastDeposit(deposit: Deposit) {
    this.io.emit('deposit', deposit);
  }

  private async handleLargeDeposit(deposit: Deposit) {
    try {
      // 通知管理员
      await this.notificationService.notifyAdmins({
        type: 'large_deposit',
        message: `大额充值警告: 用户 ${deposit.userId} 充值 ${deposit.amount} USDT`,
        data: deposit
      });

      // 记录到风控系统
      await this.notificationService.recordToRiskSystem(deposit);
    } catch (error) {
      logger.error('Error handling large deposit:', error);
    }
  }
} 