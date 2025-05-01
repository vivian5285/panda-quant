"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = require("../models/Order");
const logger_1 = require("../utils/logger");
class OrderService {
    constructor() { }
    static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    async createOrder(orderData) {
        try {
            const order = new Order_1.Order(orderData);
            await order.save();
            return order;
        }
        catch (error) {
            logger_1.logger.error('Error creating order:', error);
            throw error;
        }
    }
    async getOrderById(id) {
        try {
            return await Order_1.Order.findById(id);
        }
        catch (error) {
            logger_1.logger.error(`Error getting order ${id}:`, error);
            throw error;
        }
    }
    async updateOrderStatus(id, status) {
        try {
            return await Order_1.Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
        }
        catch (error) {
            logger_1.logger.error(`Error updating order ${id} status:`, error);
            throw error;
        }
    }
    async getOrdersByUser(userId) {
        try {
            return await Order_1.Order.find({ userId });
        }
        catch (error) {
            logger_1.logger.error(`Error getting orders for user ${userId}:`, error);
            throw error;
        }
    }
    async getOrdersByStatus(status) {
        try {
            return await Order_1.Order.find({ status });
        }
        catch (error) {
            logger_1.logger.error(`Error getting orders with status ${status}:`, error);
            throw error;
        }
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=%20OrderService.ts.Value.ToUpper()%20rderService.js.map