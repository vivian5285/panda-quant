"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const logger_1 = require("../utils/logger");
const ws_1 = __importDefault(require("ws"));
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
const Notification_1 = require("../models/Notification");
const events_1 = require("events");
const database_1 = require("../database");
const RiskEvent_1 = require("../models/RiskEvent");
const notificationLogger = (0, logger_1.createLogger)('Notification');
class NotificationService extends events_1.EventEmitter {
    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }
    constructor() {
        super();
        this.subscribers = new Map();
        this.wsConnections = new Map();
        this.wsServer = new ws_1.default.Server({ port: 8080 });
        this.clients = new Map();
        this.model = Notification_1.Notification;
        this.setupWebSocketServer(this.wsServer);
        (0, database_1.connectDB)();
        notificationLogger.info('NotificationService initialized');
    }
    addClient(userId, ws) {
        this.clients.set(userId, ws);
    }
    removeClient(userId) {
        this.clients.delete(userId);
    }
    async sendNotification(data) {
        try {
            const notification = new Notification_1.Notification({
                userId: new mongoose_1.Types.ObjectId(data.userId),
                title: data.title,
                message: data.message,
                type: data.type,
                data: data.data
            });
            await notification.save();
            return notification;
        }
        catch (error) {
            logger_1.logger.error('Error sending notification:', error);
            throw error;
        }
    }
    async sendAdminNotification(title, message, data) {
        try {
            const adminUsers = await User_1.User.find({ role: 'admin' }).lean();
            const notifications = await Promise.all(adminUsers.map(user => Notification_1.Notification.create({
                userId: user._id.toString(),
                title,
                message,
                type: 'admin',
                data,
                read: false
            })));
            adminUsers.forEach(user => {
                const client = this.clients.get(user._id.toString());
                if (client) {
                    const userNotification = notifications.find(n => n.userId.toString() === user._id.toString());
                    if (userNotification) {
                        client.send(JSON.stringify(userNotification));
                    }
                }
            });
            return notifications;
        }
        catch (error) {
            logger_1.logger.error('Error sending admin notification:', error);
            throw error;
        }
    }
    async sendRiskNotification(userId, message, data) {
        try {
            const notification = await Notification_1.Notification.create({
                userId: new mongoose_1.Types.ObjectId(userId),
                title: 'Risk Alert',
                message,
                type: 'risk',
                data,
                read: false
            });
            const client = this.clients.get(userId);
            if (client) {
                client.send(JSON.stringify(notification));
            }
            await new RiskEvent_1.RiskEvent({
                type: 'notification',
                data: {
                    userId: new mongoose_1.Types.ObjectId(userId),
                    message,
                    ...data
                }
            }).save();
            return notification;
        }
        catch (error) {
            logger_1.logger.error('Error sending risk notification:', error);
            throw error;
        }
    }
    setupWebSocketServer(wsServer) {
        wsServer.on('connection', (ws) => {
            const clientId = Math.random().toString(36).substring(7);
            this.wsConnections.set(clientId, ws);
            ws.on('close', () => {
                this.wsConnections.delete(clientId);
            });
        });
    }
    async notifyDeposit(deposit) {
        const { userId, amount } = deposit;
        // 发送通知逻辑
        logger_1.logger.info(`Deposit notification: User ${userId} deposited ${amount}`);
    }
    async createDepositNotification(deposit) {
        const notification = new Notification_1.Notification({
            type: 'deposit',
            message: `New deposit of ${deposit.amount}`,
            data: deposit
        });
        return await notification.save();
    }
    async getNotifications(userId) {
        try {
            const notifications = await Notification_1.Notification.find({
                userId: new mongoose_1.Types.ObjectId(userId)
            }).sort({ createdAt: -1 });
            return notifications;
        }
        catch (error) {
            logger_1.logger.error('Error getting notifications:', error);
            throw error;
        }
    }
    async markAsRead(id) {
        return this.model.findByIdAndUpdate(id, { read: true }, { new: true });
    }
    async createNotification(data) {
        const notification = new Notification_1.Notification({
            ...data,
            userId: data.userId ? new mongoose_1.Types.ObjectId(data.userId) : undefined
        });
        return await notification.save();
    }
    async updateNotification(id, data) {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async getNotification(id) {
        return this.model.findById(id);
    }
    async getAllNotifications() {
        return this.model.find();
    }
    async deleteNotification(id) {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
    async getNotificationsByUser(userId) {
        return this.model.find({ userId });
    }
    async getUnreadNotifications(userId) {
        return this.model.find({
            userId,
            read: false
        });
    }
    async markAllAsRead(userId) {
        const result = await this.model.updateMany({ userId, read: false }, { read: true, readAt: new Date() });
        return result.modifiedCount > 0;
    }
    async getNotificationStats(userId) {
        const [total, unread, read] = await Promise.all([
            this.model.countDocuments({ userId }),
            this.model.countDocuments({ userId, read: false }),
            this.model.countDocuments({ userId, read: true })
        ]);
        return {
            total,
            unread,
            read
        };
    }
    subscribe(userId, socket) {
        var _a;
        if (!this.subscribers.has(userId)) {
            this.subscribers.set(userId, new Set());
        }
        (_a = this.subscribers.get(userId)) === null || _a === void 0 ? void 0 : _a.add(socket);
        notificationLogger.info(`User ${userId} subscribed to notifications`);
    }
    unsubscribe(userId, socket) {
        const userSockets = this.subscribers.get(userId);
        if (userSockets) {
            userSockets.delete(socket);
            if (userSockets.size === 0) {
                this.subscribers.delete(userId);
            }
            notificationLogger.info(`User ${userId} unsubscribed from notifications`);
        }
    }
    notify(userId, message) {
        const userSockets = this.subscribers.get(userId);
        if (userSockets) {
            userSockets.forEach(socket => {
                try {
                    socket.send(JSON.stringify({ type: 'notification', message }));
                    notificationLogger.debug(`Notification sent to user ${userId}: ${message}`);
                }
                catch (error) {
                    notificationLogger.error(`Error sending notification to user ${userId}:`, error);
                    this.unsubscribe(userId, socket);
                }
            });
        }
    }
    notifyAll(message) {
        this.subscribers.forEach((sockets, userId) => {
            sockets.forEach(socket => {
                try {
                    socket.send(JSON.stringify({ type: 'notification', message }));
                    notificationLogger.debug(`Broadcast notification sent to user ${userId}: ${message}`);
                }
                catch (error) {
                    notificationLogger.error(`Error broadcasting notification to user ${userId}:`, error);
                    this.unsubscribe(userId, socket);
                }
            });
        });
    }
    async sendAdminAlert(adminId, title, message, data) {
        const notification = new this.model({
            userId: new mongoose_1.Types.ObjectId(adminId),
            type: 'admin_alert',
            title,
            message,
            data,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await notification.save();
        this.emit('notification', notification);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map