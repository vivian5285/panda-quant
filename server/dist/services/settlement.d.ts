import { SettlementFilter, SettlementResponse, SettlementSummary } from '../types/settlement';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { ISettlement } from '../interfaces/ISettlement';
interface IPlatformEarning extends Document {
    _id: Types.ObjectId;
    amount: number;
    type: string;
    status: 'pending' | 'completed' | 'failed';
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SettlementService {
    private static instance;
    private model;
    private commissionModel;
    private platformEarningModel;
    static getInstance(): SettlementService;
    constructor();
    getSettlements(filter: SettlementFilter): Promise<SettlementResponse>;
    getSettlementDetails(id: string): Promise<ISettlement | null>;
    updateSettlementStatus(id: string, status: 'completed' | 'failed'): Promise<void>;
    exportSettlements(filter: SettlementFilter): Promise<string>;
    generateSettlements(): Promise<void>;
    processPayment(id: string): Promise<void>;
    createSettlement(data: Partial<ISettlement>): Promise<Document<unknown, {}, import("../models/Settlement").ISettlementDocument, {}> & import("../models/Settlement").ISettlementDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllSettlements(): Promise<ISettlement[]>;
    getSettlementById(id: string): Promise<ISettlement>;
    updateSettlement(id: string, settlementData: Partial<ISettlement>): Promise<ISettlement>;
    deleteSettlement(id: string): Promise<void>;
    createPlatformEarning(earningData: Partial<IPlatformEarning>): Promise<IPlatformEarning>;
    getAllPlatformEarnings(): Promise<IPlatformEarning[]>;
    getPlatformEarningById(id: string): Promise<IPlatformEarning>;
    updatePlatformEarning(id: string, earningData: Partial<IPlatformEarning>): Promise<IPlatformEarning>;
    deletePlatformEarning(id: string): Promise<void>;
    calculateSettlementSummary(): Promise<any>;
    processSettlement(settlement: ISettlement): Promise<void>;
    private createCommission;
    getSettlementSummary(startDate: Date, endDate: Date): Promise<SettlementSummary>;
    getSettlementByUserId(userId: string): Promise<ISettlement[]>;
    getSettlementSummaryByUser(userId: string): Promise<{
        totalAmount: number;
        settlements: ISettlement[];
    }>;
    processPendingCommissions(): Promise<void>;
}
export {};
