import { IOrder } from '../types/IOrder';
import { Order } from '../models/Order';
import { logger } from '../utils/logger';
import { OrderStatus } from '../types';
import { Document } from 'mongoose';

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public async createOrder(orderData: Partial<IOrder>): Promise<IOrder & Document> {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  public async getOrderById(id: string): Promise<(IOrder & Document) | null> {
    try {
      return await Order.findById(id);
    } catch (error) {
      logger.error(`Error getting order ${id}:`, error);
      throw error;
    }
  }

  public async updateOrderStatus(id: string, status: OrderStatus): Promise<(IOrder & Document) | null> {
    try {
      return await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      logger.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  }

  public async getOrdersByUser(userId: string): Promise<(IOrder & Document)[]> {
    try {
      return await Order.find({ userId });
    } catch (error) {
      logger.error(`Error getting orders for user ${userId}:`, error);
      throw error;
    }
  }

  public async getOrdersByStatus(status: OrderStatus): Promise<(IOrder & Document)[]> {
    try {
      return await Order.find({ status });
    } catch (error) {
      logger.error(`Error getting orders with status ${status}:`, error);
      throw error;
    }
  }
} 