import { IStrategy } from '../types/strategy';
import { IOrder } from '../types/IOrder';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class StrategyEngine {
  private strategies: Map<string, IStrategy>;
  private orders: Map<string, IOrder>;

  constructor() {
    this.strategies = new Map();
    this.orders = new Map();
  }

  async executeStrategy(strategy: IStrategy & { _id: Types.ObjectId }): Promise<void> {
    try {
      // 执行策略的逻辑
      logger.info(`Strategy ${strategy._id} executed successfully`);
    } catch (error) {
      logger.error(`Error executing strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  async stopStrategy(strategy: IStrategy & { _id: Types.ObjectId }): Promise<void> {
    try {
      // 停止策略执行的逻辑
      this.strategies.delete(strategy._id.toString());
      logger.info(`Strategy ${strategy._id} stopped`);
    } catch (error) {
      logger.error(`Error stopping strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  createOrder(order: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>): IOrder {
    const newOrder: IOrder = {
      _id: new Types.ObjectId(),
      ...order,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(newOrder._id.toString(), newOrder);
    return newOrder;
  }
}