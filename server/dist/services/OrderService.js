import { Order } from '../models/Order';
import { logger } from '../utils/logger';
export class OrderService {
    constructor() { }
    static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            const savedOrder = await order.save();
            return savedOrder.toObject();
        }
        catch (error) {
            logger.error('Error creating order:', error);
            throw error;
        }
    }
    async getOrderById(id) {
        try {
            const order = await Order.findById(id);
            return order ? order.toObject() : null;
        }
        catch (error) {
            logger.error(`Error getting order ${id}:`, error);
            throw error;
        }
    }
    async updateOrderStatus(id, status) {
        try {
            const order = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
            return order ? order.toObject() : null;
        }
        catch (error) {
            logger.error(`Error updating order ${id} status:`, error);
            throw error;
        }
    }
    async getOrdersByUser(userId) {
        try {
            const orders = await Order.find({ userId });
            return orders.map(order => order.toObject());
        }
        catch (error) {
            logger.error(`Error getting orders for user ${userId}:`, error);
            throw error;
        }
    }
    async getOrdersByStatus(status) {
        try {
            const orders = await Order.find({ status });
            return orders.map(order => order.toObject());
        }
        catch (error) {
            logger.error(`Error getting orders with status ${status}:`, error);
            throw error;
        }
    }
}
//# sourceMappingURL=OrderService.js.map