import { logger } from '../utils/logger';
import { Order, OrderStatus } from '../interfaces/order';
import { v4 as uuidv4 } from 'uuid';

export class OrderQueueService {
  private static instance: OrderQueueService;
  private queue: Map<string, Order>;
  private processing: Set<string>;
  private maxRetries: number;
  private retryDelay: number;

  private constructor() {
    this.queue = new Map();
    this.processing = new Set();
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5秒
  }

  public static getInstance(): OrderQueueService {
    if (!OrderQueueService.instance) {
      OrderQueueService.instance = new OrderQueueService();
    }
    return OrderQueueService.instance;
  }

  public async addOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const orderId = uuidv4();
    const newOrder: Order = {
      ...order,
      id: orderId,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      retryCount: 0,
    };

    this.queue.set(orderId, newOrder);
    logger.info(`Order ${orderId} added to queue`);
    return orderId;
  }

  public async processOrder(orderId: string): Promise<void> {
    if (this.processing.has(orderId)) {
      logger.warn(`Order ${orderId} is already being processed`);
      return;
    }

    const order = this.queue.get(orderId);
    if (!order) {
      logger.error(`Order ${orderId} not found in queue`);
      return;
    }

    this.processing.add(orderId);
    try {
      // 执行订单
      await this.executeOrder(order);
      order.status = OrderStatus.COMPLETED;
      logger.info(`Order ${orderId} completed successfully`);
    } catch (error) {
      logger.error(`Error processing order ${orderId}:`, error);
      
      if (order.retryCount < this.maxRetries) {
        order.retryCount++;
        order.status = OrderStatus.RETRYING;
        logger.info(`Retrying order ${orderId} (attempt ${order.retryCount}/${this.maxRetries})`);
        
        // 延迟重试
        setTimeout(() => {
          this.processing.delete(orderId);
          this.processOrder(orderId);
        }, this.retryDelay);
      } else {
        order.status = OrderStatus.FAILED;
        logger.error(`Order ${orderId} failed after ${this.maxRetries} retries`);
      }
    } finally {
      order.updatedAt = new Date();
      this.queue.set(orderId, order);
      this.processing.delete(orderId);
    }
  }

  public async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.queue.get(orderId);
    if (!order) {
      logger.error(`Order ${orderId} not found in queue`);
      return false;
    }

    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.FAILED) {
      logger.warn(`Cannot cancel order ${orderId} in status ${order.status}`);
      return false;
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedAt = new Date();
    this.queue.set(orderId, order);
    logger.info(`Order ${orderId} cancelled successfully`);
    return true;
  }

  public getOrderStatus(orderId: string): OrderStatus | null {
    const order = this.queue.get(orderId);
    return order ? order.status : null;
  }

  private async executeOrder(order: Order): Promise<void> {
    // TODO: 实现实际的订单执行逻辑
    // 这里应该调用交易所API执行订单
    logger.info(`Executing order ${order.id}`);
    // 模拟订单执行
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
} 