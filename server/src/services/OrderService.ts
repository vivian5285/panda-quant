import { Types } from 'mongoose';
import { Order, IOrder, IOrderDocument } from '../models/Order.model';
import { OrderCreateInput, OrderUpdateInput } from '../types/Trading';
import { logger } from '../utils/Logger';
import { OrderStatus } from '../types/Enums';
import { AppError } from '../utils/AppError';

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  private convertToIOrder(order: IOrderDocument): IOrder {
    return {
      _id: order._id,
      userId: order.userId,
      strategyId: order.strategyId,
      symbol: order.symbol,
      type: order.type,
      side: order.side,
      status: order.status,
      price: order.price,
      quantity: order.quantity,
      filledQuantity: order.filledQuantity,
      remainingQuantity: order.remainingQuantity,
      timeInForce: order.timeInForce,
      metadata: order.metadata,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  async createOrder(orderData: OrderCreateInput): Promise<IOrderDocument> {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw new AppError('Failed to create order', 500);
    }
  }

  async getOrderById(id: string): Promise<IOrderDocument | null> {
    try {
      return await Order.findById(id);
    } catch (error) {
      logger.error('Error getting order:', error);
      throw new AppError('Failed to get order', 500);
    }
  }

  async getOrdersByUser(userId: string): Promise<IOrderDocument[]> {
    try {
      return await Order.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      logger.error('Error getting user orders:', error);
      throw new AppError('Failed to get user orders', 500);
    }
  }

  async getOrdersByStrategy(strategyId: string): Promise<IOrderDocument[]> {
    try {
      return await Order.find({ strategyId: new Types.ObjectId(strategyId) });
    } catch (error) {
      logger.error('Error getting strategy orders:', error);
      throw new AppError('Failed to get strategy orders', 500);
    }
  }

  async updateOrder(id: string, orderData: OrderUpdateInput): Promise<IOrderDocument | null> {
    try {
      return await Order.findByIdAndUpdate(
        id,
        { ...orderData, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating order:', error);
      throw new AppError('Failed to update order', 500);
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const result = await Order.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting order:', error);
      throw new AppError('Failed to delete order', 500);
    }
  }

  async getOrderStats(userId: string): Promise<{
    totalOrders: number;
    successfulOrders: number;
    failedOrders: number;
    averageExecutionTime: number;
  }> {
    try {
      const orders = await Order.find({ userId: new Types.ObjectId(userId) });
      const executionTimes = orders
        .filter(order => order.status === OrderStatus.CLOSED)
        .map(order => order.updatedAt.getTime() - order.createdAt.getTime());

      return {
        totalOrders: orders.length,
        successfulOrders: orders.filter(order => order.status === OrderStatus.CLOSED).length,
        failedOrders: orders.filter(order => order.status === OrderStatus.FAILED).length,
        averageExecutionTime: executionTimes.length > 0
          ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
          : 0
      };
    } catch (error) {
      logger.error('Error getting order stats:', error);
      throw new AppError('Failed to get order stats', 500);
    }
  }

  async getOrderHistory(userId: string, startDate: Date, endDate: Date): Promise<IOrderDocument[]> {
    try {
      return await Order.find({
        userId: new Types.ObjectId(userId),
        createdAt: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error getting order history:', error);
      throw new AppError('Failed to get order history', 500);
    }
  }

  async getOrderMetrics(userId: string): Promise<{
    totalVolume: number;
    averageOrderSize: number;
    successRate: number;
    averageExecutionTime: number;
  }> {
    try {
      const orders = await Order.find({ userId: new Types.ObjectId(userId) });
      const filledOrders = orders.filter(order => order.status === OrderStatus.CLOSED);
      const executionTimes = filledOrders.map(
        order => order.updatedAt.getTime() - order.createdAt.getTime()
      );

      return {
        totalVolume: filledOrders.reduce((sum, order) => sum + order.quantity, 0),
        averageOrderSize: filledOrders.length > 0
          ? filledOrders.reduce((sum, order) => sum + order.quantity, 0) / filledOrders.length
          : 0,
        successRate: orders.length > 0
          ? (filledOrders.length / orders.length) * 100
          : 0,
        averageExecutionTime: executionTimes.length > 0
          ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
          : 0
      };
    } catch (error) {
      logger.error('Error getting order metrics:', error);
      throw new AppError('Failed to get order metrics', 500);
    }
  }
}

export const orderService = OrderService.getInstance(); 