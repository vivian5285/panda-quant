import { IAlert } from '../interfaces/IAlert';
import { Document } from 'mongoose';
export declare class AlertService {
    private static instance;
    private model;
    static getInstance(): AlertService;
    private constructor();
    createAlert(data: Partial<IAlert>): Promise<IAlert & Document>;
    updateAlert(id: string, data: Partial<IAlert>): Promise<(IAlert & Document) | null>;
    getAlert(id: string): Promise<(IAlert & Document) | null>;
    getAllAlerts(): Promise<(IAlert & Document)[]>;
    deleteAlert(id: string): Promise<boolean>;
    getAlertsByUser(userId: string): Promise<(IAlert & Document)[]>;
    getActiveAlerts(): Promise<(IAlert & Document)[]>;
    getTriggeredAlerts(): Promise<(IAlert & Document)[]>;
    getDisabledAlerts(): Promise<(IAlert & Document)[]>;
    disableAlert(id: string): Promise<(IAlert & Document) | null>;
    enableAlert(id: string): Promise<(IAlert & Document) | null>;
    getAlertStats(userId: string): Promise<{
        total: number;
        active: number;
        triggered: number;
        disabled: number;
    }>;
}
