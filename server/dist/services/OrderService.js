"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = new Order_1.Order(orderData);
                const savedOrder = yield order.save();
                return savedOrder.toObject();
            }
            catch (error) {
                logger_1.logger.error('Error creating order:', error);
                throw error;
            }
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.Order.findById(id);
                return order ? order.toObject() : null;
            }
            catch (error) {
                logger_1.logger.error(`Error getting order ${id}:`, error);
                throw error;
            }
        });
    }
    updateOrderStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
                return order ? order.toObject() : null;
            }
            catch (error) {
                logger_1.logger.error(`Error updating order ${id} status:`, error);
                throw error;
            }
        });
    }
    getOrdersByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield Order_1.Order.find({ userId });
                return orders.map(order => order.toObject());
            }
            catch (error) {
                logger_1.logger.error(`Error getting orders for user ${userId}:`, error);
                throw error;
            }
        });
    }
    getOrdersByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield Order_1.Order.find({ status });
                return orders.map(order => order.toObject());
            }
            catch (error) {
                logger_1.logger.error(`Error getting orders with status ${status}:`, error);
                throw error;
            }
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map