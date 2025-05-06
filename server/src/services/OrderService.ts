import { Types } from 'mongoose';
import { IOrder, OrderStatus } from '../types/Trading';
import { Order } from '../models/Order';
import { logger } from '../utils/logger';
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

  public async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    try {
      const order = new Order(orderData);
      const savedOrder = await order.save();
      return savedOrder.toObject();
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  public async getOrderById(id: string): Promise<IOrder | null> {
    try {
      const order = await Order.findById(id);
      return order ? order.toObject() : null;
    } catch (error) {
      logger.error(`Error getting order ${id}:`, error);
      throw error;
    }
  }

  public async updateOrderStatus(id: string, status: OrderStatus): Promise<IOrder | null> {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return order ? order.toObject() : null;
    } catch (error) {
      logger.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  }

  public async getOrdersByUser(userId: string): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ userId });
      return orders.map(order => order.toObject());
    } catch (error) {
      logger.error(`Error getting orders for user ${userId}:`, error);
      throw error;
    }
  }

  public async getOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ status });
      return orders.map(order => order.toObject());
    } catch (error) {
      logger.error(`Error getting orders with status ${status}:`, error);
      throw error;
    }
  }
} 