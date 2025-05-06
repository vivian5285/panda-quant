import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
export class OrderQueueService {
    constructor() {
        this.queue = [];
    }
    async addOrder(order) {
        try {
            this.queue.push(order);
            logger.info(`Order added to queue: ${order.id}`);
        }
        catch (error) {
            logger.error('Error adding order to queue:', error);
            throw new AppError('Failed to add order to queue', 500);
        }
    }
    async getNextOrder() {
        try {
            return this.queue.shift() || null;
        }
        catch (error) {
            logger.error('Error getting next order from queue:', error);
            throw new AppError('Failed to get next order from queue', 500);
        }
    }
    async getQueueLength() {
        return this.queue.length;
    }
    async clearQueue() {
        try {
            this.queue = [];
            logger.info('Order queue cleared');
        }
        catch (error) {
            logger.error('Error clearing order queue:', error);
            throw new AppError('Failed to clear order queue', 500);
        }
    }
    async getQueue() {
        return [...this.queue];
    }
}
//# sourceMappingURL=orderQueueService.js.map