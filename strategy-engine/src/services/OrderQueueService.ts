import { logger } from '../utils/logger';
import { Order, OrderStatus, OrderType, OrderSide } from '../types/order';
import { v4 as uuidv4 } from 'uuid';

export class OrderQueueService {
  private static instance: OrderQueueService;
  private queue: Map<string, Order> = new Map();
  private processing: Set<string> = new Set();
  private maxRetries: number = 3;
  private retryDelay: number = 5000;

  private constructor() {}

  static getInstance(): OrderQueueService {
    if (!OrderQueueService.instance) {
      OrderQueueService.instance = new OrderQueueService();
    }
    return OrderQueueService.instance;
  }

  async addOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const orderId = uuidv4();
    const newOrder: Order = {
      ...order,
      id: orderId,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.queue.set(orderId, newOrder);
    logger.info(`Order ${orderId} added to queue`);
    return orderId;
  }

  async processOrder(orderId: string): Promise<void> {
    if (this.processing.has(orderId)) {
      logger.warn(`Order ${orderId} is already being processed`);
      return;
    }

    this.processing.add(orderId);
    const order = this.queue.get(orderId);
    if (!order) {
      logger.error(`Order ${orderId} not found in queue`);
      this.processing.delete(orderId);
      return;
    }

    try {
      // 执行订单
      await this.executeOrder(order);
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

  async cancelOrder(orderId: string): Promise<boolean> {
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

  getOrderStatus(orderId: string): OrderStatus | null {
    const order = this.queue.get(orderId);
    return order ? order.status : null;
  }

  private async executeOrder(order: Order): Promise<void> {
    // 实现订单执行逻辑
    // 这里应该调用交易所 API 执行订单
    // 模拟执行成功
    order.status = OrderStatus.COMPLETED;
  }
} 