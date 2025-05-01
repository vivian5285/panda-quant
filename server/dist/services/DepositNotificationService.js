"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositNotificationService = void 0;
const socket_io_1 = require("socket.io");
const notificationService_1 = require("./notificationService");
const logger_1 = require("../utils/logger");
const events_1 = require("events");
const depositNotification_1 = require("../models/depositNotification");
const Notification_1 = require("../models/Notification");
class DepositNotificationService extends events_1.EventEmitter {
    constructor() {
        super();
        this.LARGE_DEPOSIT_THRESHOLD = 10000; // 10,000 USD
        this.model = Notification_1.Notification;
        this.io = new socket_io_1.Server();
        this.notificationService = notificationService_1.NotificationService.getInstance();
    }
    static getInstance() {
        if (!DepositNotificationService.instance) {
            DepositNotificationService.instance = new DepositNotificationService();
        }
        return DepositNotificationService.instance;
    }
    setupWebSocketServer(server) {
        this.io = new socket_io_1.Server(server);
    }
    async processDeposit(deposit) {
        try {
            await this.handleDeposit(deposit);
            if (deposit.amount >= this.LARGE_DEPOSIT_THRESHOLD) {
                await this.handleLargeDeposit(deposit);
            }
        }
        catch (error) {
            console.error('Error processing deposit notification:', error);
        }
    }
    async handleDeposit(deposit) {
        try {
            const notification = new depositNotification_1.DepositNotification({
                userId: deposit.userId,
                depositId: deposit._id,
                type: 'deposit',
                message: `New deposit of ${deposit.amount} ${deposit.currency}`,
                metadata: {
                    amount: deposit.amount,
                    currency: deposit.currency,
                    txId: deposit.txId
                }
            });
            await notification.save();
            this.emit('depositReceived', deposit);
            this.broadcastDeposit(deposit);
        }
        catch (error) {
            console.error('Error handling deposit notification:', error);
        }
    }
    broadcastDeposit(deposit) {
        this.io.emit('deposit', deposit);
    }
    async handleLargeDeposit(deposit) {
        try {
            const notification = new depositNotification_1.DepositNotification({
                userId: deposit.userId,
                depositId: deposit._id,
                type: 'large_deposit',
                message: `Large deposit detected: ${deposit.amount} ${deposit.currency}`,
                metadata: {
                    amount: deposit.amount,
                    currency: deposit.currency,
                    txId: deposit.txId
                }
            });
            await notification.save();
            this.emit('largeDepositReceived', deposit);
        }
        catch (error) {
            console.error('Error handling large deposit notification:', error);
        }
    }
    async createDepositNotification(deposit) {
        return this.model.create({
            userId: deposit.userId,
            type: 'deposit',
            title: 'Deposit Received',
            message: `Your deposit of ${deposit.amount} has been received and is being processed.`,
            data: {
                depositId: deposit._id,
                amount: deposit.amount,
                currency: deposit.currency,
                status: deposit.status
            }
        });
    }
    async createDepositSuccessNotification(deposit) {
        return this.model.create({
            userId: deposit.userId,
            type: 'deposit_success',
            title: 'Deposit Successful',
            message: `Your deposit of ${deposit.amount} has been successfully processed.`,
            data: {
                depositId: deposit._id,
                amount: deposit.amount,
                currency: deposit.currency,
                status: deposit.status
            }
        });
    }
    async createDepositFailureNotification(deposit, reason) {
        return this.model.create({
            userId: deposit.userId,
            type: 'deposit_failure',
            title: 'Deposit Failed',
            message: `Your deposit of ${deposit.amount} has failed. Reason: ${reason}`,
            data: {
                depositId: deposit._id,
                amount: deposit.amount,
                currency: deposit.currency,
                status: deposit.status,
                reason
            }
        });
    }
    async getDepositNotifications(userId) {
        return this.model.find({
            userId,
            type: { $in: ['deposit', 'deposit_success', 'deposit_failure'] }
        }).sort({ createdAt: -1 });
    }
    async markDepositNotificationsAsRead(userId) {
        const result = await this.model.updateMany({
            userId,
            type: { $in: ['deposit', 'deposit_success', 'deposit_failure'] },
            read: false
        }, { read: true, readAt: new Date() });
        return result.modifiedCount > 0;
    }
    async notifyDeposit(deposit) {
        try {
            const notification = new depositNotification_1.DepositNotification({
                userId: deposit.userId.toString(),
                depositId: deposit._id.toString(),
                amount: deposit.amount,
                status: deposit.status,
                metadata: {
                    txId: deposit.txId
                }
            });
            await notification.save();
            await this.notificationService.sendNotification({
                userId: deposit.userId.toString(),
                title: 'Deposit Notification',
                message: `Your deposit of ${deposit.amount} has been ${deposit.status}`,
                type: 'deposit',
                data: {
                    depositId: deposit._id.toString(),
                    amount: deposit.amount,
                    status: deposit.status
                }
            });
            logger_1.logger.info(`Deposit notification sent for deposit ${deposit._id.toString()}`);
        }
        catch (error) {
            logger_1.logger.error('Error sending deposit notification:', error);
            throw error;
        }
    }
    async processDepositNotification(deposit) {
        try {
            const notification = new depositNotification_1.DepositNotification({
                userId: deposit.userId.toString(),
                depositId: deposit._id.toString(),
                amount: deposit.amount,
                status: deposit.status,
                metadata: {
                    txId: deposit.txId
                }
            });
            await notification.save();
            await this.notificationService.sendNotification({
                userId: deposit.userId.toString(),
                title: 'Deposit Processed',
                message: `Your deposit of ${deposit.amount} has been processed`,
                type: 'deposit',
                data: {
                    depositId: deposit._id.toString(),
                    amount: deposit.amount,
                    status: deposit.status
                }
            });
            logger_1.logger.info(`Deposit notification processed for deposit ${deposit._id.toString()}`);
        }
        catch (error) {
            logger_1.logger.error('Error processing deposit notification:', error);
            throw error;
        }
    }
}
exports.DepositNotificationService = DepositNotificationService;
//# sourceMappingURL=DepositNotificationService.js.map