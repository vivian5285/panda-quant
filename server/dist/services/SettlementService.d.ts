/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Types } from 'mongoose';
import { IPlatformEarning } from '../models/PlatformEarning';
import { SettlementFilter, SettlementResponse, SettlementSummary } from '../types/Settlement';
import { ISettlement, ISettlementDocument, SettlementMetadata, SettlementStatus } from '../types/Settlement';
export declare class SettlementService {
    private static instance;
    private model;
    private commissionModel;
    private platformEarningModel;
    private userModel;
    private constructor();
    static getInstance(): SettlementService;
    getSettlements(filter: SettlementFilter): Promise<SettlementResponse>;
    getSettlementDetails(id: string): Promise<ISettlementDocument | null>;
    updateSettlementStatus(id: string, status: SettlementStatus): Promise<ISettlement | null>;
    exportSettlements(filter: SettlementFilter): Promise<string>;
    generateSettlements(): Promise<void>;
    processPayment(id: string): Promise<ISettlement | null>;
    createSettlement(userId: Types.ObjectId, amount: number, type: string, metadata?: Record<string, any>): Promise<ISettlement>;
    getAllSettlements(): Promise<ISettlementDocument[]>;
    getSettlementById(id: string): Promise<ISettlement | null>;
    updateSettlement(id: string, settlement: Partial<ISettlement>): Promise<ISettlement | null>;
    deleteSettlement(id: string): Promise<boolean>;
    createPlatformEarning(earningData: {
        userId: string;
        strategyId: string;
        amount: number;
        currency: string;
        type: 'commission' | 'fee' | 'other';
        description?: string;
        metadata?: Record<string, any>;
    }): Promise<IPlatformEarning>;
    getAllPlatformEarnings(): Promise<IPlatformEarning[]>;
    getPlatformEarningById(id: string): Promise<IPlatformEarning>;
    updatePlatformEarning(id: string, earningData: Partial<IPlatformEarning>): Promise<IPlatformEarning>;
    deletePlatformEarning(id: string): Promise<void>;
    calculateSettlementSummary(): Promise<SettlementSummary>;
    processSettlement(settlement: ISettlementDocument): Promise<void>;
    getSettlementSummary(startDate: Date, endDate: Date): Promise<SettlementSummary>;
    getSettlementByUserId(userId: string): Promise<ISettlementDocument[]>;
    getSettlementSummaryByUser(userId: string): Promise<{
        totalAmount: number;
        settlements: ISettlementDocument[];
    }>;
    processPendingCommissions(): Promise<void>;
    getSettlementsByUserId(userId: string, page?: number, limit?: number): Promise<{
        settlements: ISettlementDocument[];
        total: number;
    }>;
    calculateTotalAmount(metadata: SettlementMetadata): Promise<number>;
    private convertToISettlement;
    completeSettlement(id: string): Promise<ISettlement | null>;
    failSettlement(id: string): Promise<ISettlement | null>;
}
//# sourceMappingURL=SettlementService.d.ts.map