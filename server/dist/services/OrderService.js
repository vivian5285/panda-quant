"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = require("mongoose");
const order_model_1 = __importDefault(require("../models/order.model"));
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
class OrderService {
    constructor() { }
    static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    convertToIOrder(order) {
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
    async createOrder(orderData) {
        try {
            const order = new order_model_1.default({
                ...orderData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedOrder = await order.save();
            return this.convertToIOrder(savedOrder);
        }
        catch (error) {
            logger_1.logger.error('Error creating order:', error);
            throw new AppError_1.AppError('Failed to create order', 500);
        }
    }
    async getOrderById(id) {
        try {
            const order = await order_model_1.default.findById(id);
            if (!order)
                return null;
            return this.convertToIOrder(order);
        }
        catch (error) {
            logger_1.logger.error(`Error getting order ${id}:`, error);
            throw new AppError_1.AppError('Failed to get order', 500);
        }
    }
    async updateOrderStatus(id, status) {
        try {
            const order = await order_model_1.default.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
            if (!order)
                return null;
            return this.convertToIOrder(order);
        }
        catch (error) {
            logger_1.logger.error(`Error updating order ${id} status:`, error);
            throw new AppError_1.AppError('Failed to update order status', 500);
        }
    }
    async getOrdersByUser(userId) {
        try {
            const orders = await order_model_1.default.find({ userId: new mongoose_1.Types.ObjectId(userId) });
            return orders.map(order => this.convertToIOrder(order));
        }
        catch (error) {
            logger_1.logger.error(`Error getting orders for user ${userId}:`, error);
            throw new AppError_1.AppError('Failed to get user orders', 500);
        }
    }
    async getOrdersByStatus(status) {
        try {
            const orders = await order_model_1.default.find({ status });
            return orders.map(order => this.convertToIOrder(order));
        }
        catch (error) {
            logger_1.logger.error(`Error getting orders with status ${status}:`, error);
            throw new AppError_1.AppError('Failed to get orders by status', 500);
        }
    }
    async getOrdersByStrategyId(strategyId) {
        try {
            const orders = await order_model_1.default.find({ strategyId: new mongoose_1.Types.ObjectId(strategyId) });
            return orders.map(order => this.convertToIOrder(order));
        }
        catch (error) {
            logger_1.logger.error('Error getting orders by strategy id:', error);
            throw new AppError_1.AppError('Failed to get strategy orders', 500);
        }
    }
    async getOrdersByUserId(userId) {
        try {
            const orders = await order_model_1.default.find({ userId: new mongoose_1.Types.ObjectId(userId) });
            return orders.map(order => this.convertToIOrder(order));
        }
        catch (error) {
            logger_1.logger.error('Error getting orders by user id:', error);
            throw new AppError_1.AppError('Failed to get user orders', 500);
        }
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map