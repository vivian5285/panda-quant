import WebSocket from 'ws';
import { Types, Document } from 'mongoose';
import { INotification } from '../types/notification';
import { EventEmitter } from 'events';
import { Deposit } from '../models/Deposit';
import { IDeposit } from '../types/deposit';
export declare class NotificationService extends EventEmitter {
    private static instance;
    private wsServer;
    private clients;
    private model;
    private subscribers;
    private wsConnections;
    static getInstance(): NotificationService;
    private constructor();
    addClient(userId: string, ws: WebSocket): void;
    removeClient(userId: string): void;
    sendNotification(data: {
        userId: string;
        title: string;
        message: string;
        type: string;
        data?: any;
    }): Promise<any>;
    sendAdminNotification(title: string, message: string, data?: any): Promise<any>;
    sendRiskNotification(userId: string, message: string, data?: any): Promise<any>;
    private setupWebSocketServer;
    notifyDeposit(deposit: InstanceType<typeof Deposit> & {
        _id: Types.ObjectId;
    }): Promise<void>;
    createDepositNotification(deposit: IDeposit): Promise<any>;
    getNotifications(userId: string): Promise<any[]>;
    markAsRead(id: string): Promise<(INotification & Document) | null>;
    createNotification(data: Partial<INotification>): Promise<INotification & Document>;
    updateNotification(id: string, data: Partial<INotification>): Promise<(INotification & Document) | null>;
    getNotification(id: string): Promise<(INotification & Document) | null>;
    getAllNotifications(): Promise<(INotification & Document)[]>;
    deleteNotification(id: string): Promise<boolean>;
    getNotificationsByUser(userId: string): Promise<(INotification & Document)[]>;
    getUnreadNotifications(userId: string): Promise<(INotification & Document)[]>;
    markAllAsRead(userId: string): Promise<boolean>;
    getNotificationStats(userId: string): Promise<{
        total: number;
        unread: number;
        read: number;
    }>;
    subscribe(userId: string, socket: WebSocket): void;
    unsubscribe(userId: string, socket: WebSocket): void;
    notify(userId: string, message: string): void;
    notifyAll(message: string): void;
    sendAdminAlert(adminId: string, title: string, message: string, data?: any): Promise<void>;
}
