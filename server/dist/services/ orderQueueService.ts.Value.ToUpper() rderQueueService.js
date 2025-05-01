"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderQueueService = void 0;
const Order_1 = require("../models/Order");
const logger_1 = require("../utils/logger");
const events_1 = require("events");
class OrderQueueService extends events_1.EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.isProcessing = false;
        this.orderModel = Order_1.Order;
    }
    static getInstance() {
        if (!OrderQueueService.instance) {
            OrderQueueService.instance = new OrderQueueService();
        }
        return OrderQueueService.instance;
    }
    async addOrder(order) {
        try {
            const newOrder = await this.orderModel.create(order);
            logger_1.logger.info(`Order ${newOrder._id} added to queue`);
            this.queue.push(newOrder);
            this.emit('orderAdded', newOrder);
            if (!this.isProcessing) {
                await this.processQueue();
            }
            return newOrder;
        }
        catch (error) {
            logger_1.logger.error('Error adding order to queue:', error);
            throw error;
        }
    }
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }
        this.isProcessing = true;
        try {
            while (this.queue.length > 0) {
                const order = this.queue[0];
                await this.processOrder(order);
                this.queue.shift();
            }
        }
        catch (error) {
            logger_1.logger.error('Error processing order queue:', error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    async processOrder(order) {
        try {
            // Process order logic here
            this.emit('orderProcessed', order);
        }
        catch (error) {
            this.emit('orderError', { order, error });
        }
    }
    getQueue() {
        return this.queue;
    }
    async getNextOrder() {
        try {
            const order = await this.orderModel.findOne({ status: 'pending' }).sort({ createdAt: 1 });
            return order;
        }
        catch (error) {
            logger_1.logger.error('Error getting next order:', error);
            throw error;
        }
    }
    async updateOrderStatus(orderId, status) {
        try {
            const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
            return order;
        }
        catch (error) {
            logger_1.logger.error('Error updating order status:', error);
            throw error;
        }
    }
}
exports.OrderQueueService = OrderQueueService;
//# sourceMappingURL=%20orderQueueService.ts.Value.ToUpper()%20rderQueueService.js.map