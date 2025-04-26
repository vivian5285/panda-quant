import { WebSocketServer } from 'ws';
import { NotificationService } from './NotificationService';
import { Deposit } from '../types/deposit';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export class DepositNotificationService extends EventEmitter {
  private static instance: DepositNotificationService;
  private wss: WebSocketServer;
  private notificationService: NotificationService;
  private largeDepositThreshold = 10000;

  private constructor() {
    super();
    this.wss = new WebSocketServer({ port: 8081 });
    this.notificationService = new NotificationService();
    this.initializeWebSocket();
  }

  public static getInstance(): DepositNotificationService {
    if (!DepositNotificationService.instance) {
      DepositNotificationService.instance = new DepositNotificationService();
    }
    return DepositNotificationService.instance;
  }

  private initializeWebSocket() {
    this.wss.on('connection', (ws) => {
      logger.info('New deposit notification connection established');

      ws.on('message', async (message) => {
        try {
          const deposit = JSON.parse(message.toString()) as Deposit;
          await this.handleDeposit(deposit);
        } catch (error) {
          logger.error('Error processing deposit message:', error);
        }
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        logger.info('Deposit notification connection closed');
      });
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
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(deposit));
      }
    });
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