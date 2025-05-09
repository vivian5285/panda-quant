import { Types } from 'mongoose';
import Order from '../models/order.model';
import { IOrder, IOrderDocument, IOrderCreateInput, IOrderUpdateInput } from '../types/Trading';
import { logger } from '../utils/logger';
import { OrderStatus } from '../types/Enums';
import { AppError } from '../utils/AppError';

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  private convertToIOrder(order: IOrderDocument): IOrder {
    const orderObject = order.toObject();
    return {
      ...orderObject,
      _id: orderObject._id,
      userId: orderObject.userId,
      strategyId: orderObject.strategyId,
      positionId: orderObject.positionId,
      exchange: orderObject.exchange,
      symbol: orderObject.symbol,
      orderId: orderObject.orderId,
      clientOrderId: orderObject.clientOrderId,
      type: orderObject.type,
      side: orderObject.side,
      amount: orderObject.amount,
      price: orderObject.price,
      stopPrice: orderObject.stopPrice,
      status: orderObject.status,
      filledAmount: orderObject.filledAmount,
      averageFillPrice: orderObject.averageFillPrice,
      fee: orderObject.fee,
      feeCurrency: orderObject.feeCurrency,
      error: orderObject.error,
      metadata: orderObject.metadata,
      createdAt: orderObject.createdAt,
      updatedAt: orderObject.updatedAt,
      closedAt: orderObject.closedAt
    };
  }

  public async createOrder(orderData: IOrderCreateInput): Promise<IOrder> {
    try {
      const order = new Order({
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedOrder = await order.save();
      return this.convertToIOrder(savedOrder);
    } catch (error) {
      logger.error('Error creating order:', error);
      throw new AppError('Failed to create order', 500);
    }
  }

  public async getOrderById(id: string): Promise<IOrder | null> {
    try {
      const order = await Order.findById(id);
      if (!order) return null;
      return this.convertToIOrder(order);
    } catch (error) {
      logger.error(`Error getting order ${id}:`, error);
      throw new AppError('Failed to get order', 500);
    }
  }

  public async updateOrderStatus(id: string, status: OrderStatus): Promise<IOrder | null> {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      if (!order) return null;
      return this.convertToIOrder(order);
    } catch (error) {
      logger.error(`Error updating order ${id} status:`, error);
      throw new AppError('Failed to update order status', 500);
    }
  }

  public async getOrdersByUser(userId: string): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ userId: new Types.ObjectId(userId) });
      return orders.map(order => this.convertToIOrder(order));
    } catch (error) {
      logger.error(`Error getting orders for user ${userId}:`, error);
      throw new AppError('Failed to get user orders', 500);
    }
  }

  public async getOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ status });
      return orders.map(order => this.convertToIOrder(order));
    } catch (error) {
      logger.error(`Error getting orders with status ${status}:`, error);
      throw new AppError('Failed to get orders by status', 500);
    }
  }

  async getOrdersByStrategyId(strategyId: string): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ strategyId: new Types.ObjectId(strategyId) });
      return orders.map(order => this.convertToIOrder(order));
    } catch (error) {
      logger.error('Error getting orders by strategy id:', error);
      throw new AppError('Failed to get strategy orders', 500);
    }
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ userId: new Types.ObjectId(userId) });
      return orders.map(order => this.convertToIOrder(order));
    } catch (error) {
      logger.error('Error getting orders by user id:', error);
      throw new AppError('Failed to get user orders', 500);
    }
  }
} 