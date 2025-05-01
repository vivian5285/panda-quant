import { Types } from 'mongoose';
import { StrategyPerformance } from '../models/StrategyPerformance';
import { IMonitoring } from '../interfaces/IMonitoring';
import { Document } from 'mongoose';
export declare class MonitoringService {
    private static instance;
    private alertService;
    private model;
    static getInstance(): MonitoringService;
    private constructor();
    monitorStrategyPerformance(performance: InstanceType<typeof StrategyPerformance> & {
        _id: Types.ObjectId;
    }): Promise<void>;
    createMonitoring(data: Partial<IMonitoring>): Promise<IMonitoring & Document>;
    updateMonitoring(id: string, data: Partial<IMonitoring>): Promise<(IMonitoring & Document) | null>;
    getMonitoring(id: string): Promise<(IMonitoring & Document) | null>;
    getAllMonitoring(): Promise<(IMonitoring & Document)[]>;
    deleteMonitoring(id: string): Promise<boolean>;
    getMonitoringByUser(userId: string): Promise<(IMonitoring & Document)[]>;
    getActiveMonitoring(): Promise<(IMonitoring & Document)[]>;
    getInactiveMonitoring(): Promise<(IMonitoring & Document)[]>;
    getMonitoringStats(userId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        alerts: number;
    }>;
    startMonitoring(id: string): Promise<(IMonitoring & Document) | null>;
    stopMonitoring(id: string): Promise<(IMonitoring & Document) | null>;
}
