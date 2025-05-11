import { IOrder } from '../types/Order';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/Logger';

export class OrderQueueService {
  private static instance: OrderQueueService;
  private queue: IOrder[];
  
  private constructor() {
    this.queue = [];
  }
  
  public static getInstance(): OrderQueueService {
    if (!OrderQueueService.instance) {
      OrderQueueService.instance = new OrderQueueService();
    }
    return OrderQueueService.instance;
  }

  async addOrder(order: IOrder): Promise<void> {
    try {
      this.queue.push(order);
      logger.info(`Order added to queue: ${order._id}`);
    } catch (error) {
      logger.error('Error adding order to queue:', error);
      throw error;
    }
  }

  async processQueue(): Promise<void> {
    try {
      while (this.queue.length > 0) {
        const order = this.queue.shift();
        if (order) {
          await this.processOrder(order);
        }
      }
    } catch (error) {
      logger.error('Error processing order queue:', error);
      throw error;
    }
  }

  private async processOrder(order: IOrder): Promise<void> {
    try {
      // 处理订单逻辑
      logger.info(`Processing order: ${order._id}`);
    } catch (error) {
      logger.error('Error processing order:', error);
      throw error;
    }
  }

  async getNextOrder(): Promise<IOrder | null> {
    try {
      return this.queue.shift() || null;
    } catch (error) {
      logger.error('Error getting next order from queue:', error);
      throw new AppError('Failed to get next order from queue', 500);
    }
  }

  async getQueueLength(): Promise<number> {
    return this.queue.length;
  }

  async clearQueue(): Promise<void> {
    try {
      this.queue = [];
      logger.info('Order queue cleared');
    } catch (error) {
      logger.error('Error clearing order queue:', error);
      throw new AppError('Failed to clear order queue', 500);
    }
  }

  async getQueue(): Promise<IOrder[]> {
    return [...this.queue];
  }
} 