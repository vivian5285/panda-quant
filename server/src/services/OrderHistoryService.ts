import { Types } from 'mongoose';
import { OrderHistory } from '../models/OrderHistory.model';
import { IOrderHistory, IOrderHistoryDocument } from '../types/OrderHistory';
import { logger } from '../utils/Logger';

export class OrderHistoryService {
  private static instance: OrderHistoryService;

  private constructor() {}

  public static getInstance(): OrderHistoryService {
    if (!OrderHistoryService.instance) {
      OrderHistoryService.instance = new OrderHistoryService();
    }
    return OrderHistoryService.instance;
  }

  private convertToIOrderHistory(orderHistory: IOrderHistoryDocument): IOrderHistory {
    return {
      _id: orderHistory._id,
      userId: orderHistory.userId,
      strategyId: orderHistory.strategyId,
      orderId: orderHistory.orderId,
      symbol: orderHistory.symbol,
      type: orderHistory.type,
      side: orderHistory.side,
      amount: orderHistory.amount,
      price: orderHistory.price,
      status: orderHistory.status,
      createdAt: orderHistory.createdAt,
      updatedAt: orderHistory.updatedAt
    };
  }

  async createOrderHistory(orderHistoryData: Omit<IOrderHistory, '_id'>): Promise<IOrderHistory> {
    try {
      const orderHistory = new OrderHistory(orderHistoryData);
      const savedOrderHistory = await orderHistory.save();
      return this.convertToIOrderHistory(savedOrderHistory);
    } catch (error) {
      logger.error('Error creating order history:', error);
      throw error;
    }
  }

  async getOrderHistoryById(id: string): Promise<IOrderHistory | null> {
    try {
      const orderHistory = await OrderHistory.findById(id);
      return orderHistory ? this.convertToIOrderHistory(orderHistory) : null;
    } catch (error) {
      logger.error('Error getting order history:', error);
      throw error;
    }
  }

  async getOrderHistoriesByUserId(userId: string): Promise<IOrderHistory[]> {
    try {
      const orderHistories = await OrderHistory.find({ userId: new Types.ObjectId(userId) });
      return orderHistories.map(orderHistory => this.convertToIOrderHistory(orderHistory));
    } catch (error) {
      logger.error('Error getting order histories:', error);
      throw error;
    }
  }

  async getOrderHistoriesByStrategyId(strategyId: string): Promise<IOrderHistory[]> {
    try {
      const orderHistories = await OrderHistory.find({ strategyId: new Types.ObjectId(strategyId) });
      return orderHistories.map(orderHistory => this.convertToIOrderHistory(orderHistory));
    } catch (error) {
      logger.error('Error getting order histories:', error);
      throw error;
    }
  }

  async updateOrderHistory(id: string, updateData: Partial<IOrderHistory>): Promise<IOrderHistory | null> {
    try {
      const orderHistory = await OrderHistory.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      return orderHistory ? this.convertToIOrderHistory(orderHistory) : null;
    } catch (error) {
      logger.error('Error updating order history:', error);
      throw error;
    }
  }

  async deleteOrderHistory(id: string): Promise<boolean> {
    try {
      const result = await OrderHistory.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting order history:', error);
      throw error;
    }
  }
} 