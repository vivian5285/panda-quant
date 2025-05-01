"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderQueueService = void 0;
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
class OrderQueueService {
    constructor() {
        this.queue = [];
    }
    async addOrder(order) {
        try {
            this.queue.push(order);
            logger_1.logger.info(`Order added to queue: ${order.id}`);
        }
        catch (error) {
            logger_1.logger.error('Error adding order to queue:', error);
            throw new AppError_1.AppError('Failed to add order to queue', 500);
        }
    }
    async getNextOrder() {
        try {
            return this.queue.shift() || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting next order from queue:', error);
            throw new AppError_1.AppError('Failed to get next order from queue', 500);
        }
    }
    async getQueueLength() {
        return this.queue.length;
    }
    async clearQueue() {
        try {
            this.queue = [];
            logger_1.logger.info('Order queue cleared');
        }
        catch (error) {
            logger_1.logger.error('Error clearing order queue:', error);
            throw new AppError_1.AppError('Failed to clear order queue', 500);
        }
    }
    async getQueue() {
        return [...this.queue];
    }
}
exports.OrderQueueService = OrderQueueService;
//# sourceMappingURL=orderQueueService.js.map