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
exports.OrderQueueService = void 0;
const logger_1 = require("../utils/logger");
const order_1 = require("../types/order");
const uuid_1 = require("uuid");
class OrderQueueService {
    constructor() {
        this.queue = new Map();
        this.processing = new Set();
        this.maxRetries = 3;
        this.retryDelay = 5000;
    }
    static getInstance() {
        if (!OrderQueueService.instance) {
            OrderQueueService.instance = new OrderQueueService();
        }
        return OrderQueueService.instance;
    }
    addOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = (0, uuid_1.v4)();
            const newOrder = Object.assign(Object.assign({}, order), { id: orderId, status: order_1.OrderStatus.PENDING, createdAt: new Date(), updatedAt: new Date() });
            this.queue.set(orderId, newOrder);
            logger_1.logger.info(`Order ${orderId} added to queue`);
            return orderId;
        });
    }
    processOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.processing.has(orderId)) {
                logger_1.logger.warn(`Order ${orderId} is already being processed`);
                return;
            }
            this.processing.add(orderId);
            const order = this.queue.get(orderId);
            if (!order) {
                logger_1.logger.error(`Order ${orderId} not found in queue`);
                this.processing.delete(orderId);
                return;
            }
            try {
                // 执行订单
                yield this.executeOrder(order);
                logger_1.logger.info(`Order ${orderId} completed successfully`);
            }
            catch (error) {
                logger_1.logger.error(`Error processing order ${orderId}:`, error);
                if (order.retryCount < this.maxRetries) {
                    order.retryCount++;
                    order.status = order_1.OrderStatus.RETRYING;
                    logger_1.logger.info(`Retrying order ${orderId} (attempt ${order.retryCount}/${this.maxRetries})`);
                    // 延迟重试
                    setTimeout(() => {
                        this.processing.delete(orderId);
                        this.processOrder(orderId);
                    }, this.retryDelay);
                }
                else {
                    order.status = order_1.OrderStatus.FAILED;
                    logger_1.logger.error(`Order ${orderId} failed after ${this.maxRetries} retries`);
                }
            }
            finally {
                order.updatedAt = new Date();
                this.queue.set(orderId, order);
                this.processing.delete(orderId);
            }
        });
    }
    cancelOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = this.queue.get(orderId);
            if (!order) {
                logger_1.logger.error(`Order ${orderId} not found in queue`);
                return false;
            }
            if (order.status === order_1.OrderStatus.COMPLETED || order.status === order_1.OrderStatus.FAILED) {
                logger_1.logger.warn(`Cannot cancel order ${orderId} in status ${order.status}`);
                return false;
            }
            order.status = order_1.OrderStatus.CANCELLED;
            order.updatedAt = new Date();
            this.queue.set(orderId, order);
            logger_1.logger.info(`Order ${orderId} cancelled successfully`);
            return true;
        });
    }
    getOrderStatus(orderId) {
        const order = this.queue.get(orderId);
        return order ? order.status : null;
    }
    executeOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            // 实现订单执行逻辑
            // 这里应该调用交易所 API 执行订单
            // 模拟执行成功
            order.status = order_1.OrderStatus.COMPLETED;
        });
    }
}
exports.OrderQueueService = OrderQueueService;
