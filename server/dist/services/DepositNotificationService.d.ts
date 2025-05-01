import { EventEmitter } from 'events';
import { IDeposit } from '../types/deposit';
import { INotification } from '../interfaces/INotification';
import { Document } from 'mongoose';
export declare class DepositNotificationService extends EventEmitter {
    private static instance;
    private io;
    private notificationService;
    private readonly LARGE_DEPOSIT_THRESHOLD;
    private model;
    private constructor();
    static getInstance(): DepositNotificationService;
    setupWebSocketServer(server: any): void;
    processDeposit(deposit: IDeposit): Promise<void>;
    private handleDeposit;
    private broadcastDeposit;
    private handleLargeDeposit;
    createDepositNotification(deposit: IDeposit & Document): Promise<INotification & Document>;
    createDepositSuccessNotification(deposit: IDeposit & Document): Promise<INotification & Document>;
    createDepositFailureNotification(deposit: IDeposit & Document, reason: string): Promise<INotification & Document>;
    getDepositNotifications(userId: string): Promise<(INotification & Document)[]>;
    markDepositNotificationsAsRead(userId: string): Promise<boolean>;
    notifyDeposit(deposit: IDeposit): Promise<void>;
    processDepositNotification(deposit: IDeposit): Promise<void>;
}
