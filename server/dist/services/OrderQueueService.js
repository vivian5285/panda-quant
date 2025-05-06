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
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
class OrderQueueService {
    constructor() {
        this.queue = [];
    }
    addOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.queue.push(order);
                logger_1.logger.info(`Order added to queue: ${order.id}`);
            }
            catch (error) {
                logger_1.logger.error('Error adding order to queue:', error);
                throw new AppError_1.AppError('Failed to add order to queue', 500);
            }
        });
    }
    getNextOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.queue.shift() || null;
            }
            catch (error) {
                logger_1.logger.error('Error getting next order from queue:', error);
                throw new AppError_1.AppError('Failed to get next order from queue', 500);
            }
        });
    }
    getQueueLength() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queue.length;
        });
    }
    clearQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.queue = [];
                logger_1.logger.info('Order queue cleared');
            }
            catch (error) {
                logger_1.logger.error('Error clearing order queue:', error);
                throw new AppError_1.AppError('Failed to clear order queue', 500);
            }
        });
    }
    getQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...this.queue];
        });
    }
}
exports.OrderQueueService = OrderQueueService;
//# sourceMappingURL=orderQueueService.js.map