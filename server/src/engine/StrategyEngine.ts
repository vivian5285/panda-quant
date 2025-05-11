import { IStrategy } from '../types/Strategy';
import { IOrder, OrderCreateInput } from '../types/Order';
import { logger } from '../utils/Logger';
import { Types } from 'mongoose';
import { OrderStatus } from '../types/Enums';

export class StrategyEngine {
  private orders: Map<string, IOrder>;
  private strategy: IStrategy;

  constructor(strategy: IStrategy) {
    this.orders = new Map();
    this.strategy = strategy;
  }

  async executeOrder(orderData: OrderCreateInput): Promise<IOrder> {
    try {
      const orderId = this.generateOrderId();
      const newOrder: IOrder = {
        ...orderData,
        _id: new Types.ObjectId(),
        orderId,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.orders.set(orderId, newOrder);
      logger.info(`Order created: ${orderId}`);
      
      return newOrder;
    } catch (error) {
      logger.error('Error executing order:', error);
      throw error;
    }
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async executeStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 执行策略的逻辑
      logger.info(`Strategy ${strategy._id} executed successfully`);
    } catch (error) {
      logger.error(`Error executing strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  async stopStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 停止策略执行的逻辑
      this.orders.delete(strategy._id.toString());
      logger.info(`Strategy ${strategy._id} stopped`);
    } catch (error) {
      logger.error(`Error stopping strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  createOrder(order: OrderCreateInput): IOrder {
    const orderId = this.generateOrderId();
    const newOrder: IOrder = {
      ...order,
      _id: new Types.ObjectId(),
      orderId,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(orderId, newOrder);
    return newOrder;
  }
}