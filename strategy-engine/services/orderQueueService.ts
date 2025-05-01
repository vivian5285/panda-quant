import { Order, OrderStatus } from '../types';

export class OrderQueueService {
  private static instance: OrderQueueService;
  private queue: Order[];

  private constructor() {
    this.queue = [];
  }

  public static getInstance(): OrderQueueService {
    if (!OrderQueueService.instance) {
      OrderQueueService.instance = new OrderQueueService();
    }
    return OrderQueueService.instance;
  }

  public async addOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const order: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.queue.push(order);
    await this.processQueue();
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const order = this.queue[0];
      try {
        // 这里应该实现实际的订单处理逻辑
        // 例如：发送到交易所、更新数据库等
        order.status = OrderStatus.COMPLETED;
        order.updatedAt = new Date();
        this.queue.shift();
      } catch (error) {
        order.status = OrderStatus.FAILED;
        order.updatedAt = new Date();
        console.error('处理订单失败:', error);
        break;
      }
    }
  }

  public getQueue(): Order[] {
    return [...this.queue];
  }

  public clearQueue(): void {
    this.queue = [];
  }
} 