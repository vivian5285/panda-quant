import { Order, OrderStatus } from '../types';
import { RedisService } from './redis';

export class OrderQueueService {
  private static instance: OrderQueueService;
  private redisService: RedisService;

  private constructor() {
    this.redisService = RedisService.getInstance();
  }

  public static getInstance(): OrderQueueService {
    if (!OrderQueueService.instance) {
      OrderQueueService.instance = new OrderQueueService();
    }
    return OrderQueueService.instance;
  }

  async addOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const orderWithDefaults: Order = {
      ...order,
      id: crypto.randomUUID(),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.redisService.lpush('order:queue', JSON.stringify(orderWithDefaults));
  }

  async processOrder(): Promise<void> {
    const orderStr = await this.redisService.rpop('order:queue');
    if (!orderStr) return;

    const order: Order = JSON.parse(orderStr);
    try {
      // Process the order
      await this.executeOrder(order);
    } catch (error) {
      await this.retryFailedOrder(order);
    }
  }

  private async executeOrder(order: Order): Promise<void> {
    // Implementation of order execution
    // This is a placeholder for the actual order execution logic
  }

  private async retryFailedOrder(order: Order): Promise<void> {
    if (order.retryCount < 3) {
      order.retryCount++;
      await this.addOrder(order);
    } else {
      // Handle permanent failure
      order.status = OrderStatus.REJECTED;
      await this.redisService.lpush('order:failed', JSON.stringify(order));
    }
  }
} 